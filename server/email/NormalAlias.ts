import { db } from "../Database";
import { sendRawMail } from "../utils/MailSend";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { getHeader, TrustedHeaders, removeHeadersExcept, parseAddressField, setHeader } from "../utils/MailHeaders";

export async function NormalAlias(message: any, env: any, mailContent: string, data: any) {
	if(!db) throw new Error("Database error");

	// Parse to/from
	const to = parseAddressField(getHeader(mailContent, "To"));
	const from = parseAddressField(getHeader(mailContent, "From"));
	if(!to || !from) throw new Error("Malformed to/from header");

	// Grab alias
	const alias = await db
		.selectFrom("alias")
		.selectAll()
		.where("token", "==", to.mailbox)
		.where("domain", "==", to.domain)
		.select((eb) => [
			jsonObjectFrom(
				eb
				.selectFrom("destination")
				.selectAll()
				.where("destination.id", "==", "alias.destinationID")
			).as("destination"),
			jsonObjectFrom(
				eb
				.selectFrom("aliasCategory")
				.selectAll()
				.where("aliasCategory.id", "==", "alias.aliasCategoryID")
			).as("aliasCategory"),
			jsonObjectFrom(
				eb
				.selectFrom("user")
				.selectAll()
				.where("user.id", "==", "alias.userID")
			).as("user")
		])
		.limit(1)
		.executeTakeFirst();
	
	// Ensure alias and its fields exists
	if(!alias) {
		console.warn("[NormalAlias]", `REJECT: Alias '${to.mailbox}' not found`);
		message.setReject(`Mailbox "${to.mailbox}" does not exist`);
		return true;
	}
	console.log("[NormalAlias]", `Mail goes to Alias(${alias.id})`);

	if(!alias.user) {
		console.warn("[NormalAlias]", `REJECT: Alias has no User`);
		console.error("[NormalAlias]", "THIS IS A DATABASE ERROR! THERE SHOULD NEVER BE UNREACHABLE ALIASES WITHOUT USERS!");
		message.setReject(`Mailbox "${to.mailbox}" permanently unavailable`);
		return true;
	}
	console.log("[NormalAlias]", `Alias(${alias.id}) has User(${alias.user.id})`);

	if(!alias.destination) {
		console.warn("[NormalAlias]", `REJECT: Alias has no Destination`);
		message.setReject(`Mailbox "${to.mailbox}" temporarily unavailable`);
		return true;
	}
	console.log("[NormalAlias]", `Alias(${alias.id}) has Destination(${alias.destination.id})`);

	// Ensure alias and his category and destination is enabled
	if(!alias.enabled) {
		console.warn("[NormalAlias]", `REJECT: Alias is disabled`);
		message.setReject(`Mailbox "${to.mailbox}" is disabled`);
		return true;
	}

	if(!alias.destination.enabled) {
		console.warn("[NormalAlias]", `REJECT: Aliases Destination is disabled`);
		message.setReject(`Mailbox "${to.mailbox}" is disabled`);
		return true;
	}

	if(alias.aliasCategory && !alias.aliasCategory.enabled) {
		console.warn("[NormalAlias]", `REJECT: Aliases Category is disabled`);
		message.setReject(`Mailbox "${to.mailbox}" is disabled`);
		return true;
	}

	// Ensure reverse alias exists or create one
	let reverseAlias = await db
		.selectFrom("reverseAlias")
		.selectAll()
		.where("aliasID", "==", alias.id)
		.where("destinationMail", "==", from.email)
		.where("destinationName", "==", from.name)
		.limit(1)
		.executeTakeFirst();

	if(!reverseAlias) {
		console.log("[NormalAlias]", `Sender does not have an existing ReverseAlias!`);
		reverseAlias = await db
			.insertInto("reverseAlias")
			.values({
				aliasID: alias.id,
				destinationMail: from.email,
				destinationName: from.name,
			})
			.returningAll()
			.executeTakeFirstOrThrow();
		console.log(`[NormalAlias] Generated ReverseAlias(${reverseAlias.id}) for sender!`);
	}
	console.log(`[NormalAlias] Sender has ReverseAlias(${reverseAlias.id})`);

    // Ensure alias owner has incoming quota
    const totalIncomingToday = (await db
        .selectFrom("alias")
        .where("userID", "==", alias.user.id)
		.leftJoin("reverseAlias", join => join.on("reverseAlias.aliasID", "=", "alias.id"))
        .leftJoin("reverseAliasQuota", join => join.on("reverseAliasQuota.reverseAliasID", "=", "reverseAlias.id"))
		.where("reverseAliasQuota.date", "==", new Date().toISOString().slice(0, 10))
        .select(({fn}) => fn.sum("reverseAliasQuota.incomingMailCount").as("count"))
        .executeTakeFirst())?.count as number|null || 0;
	console.log(`[NormalAlias] User(${alias.user.id}) had ${totalIncomingToday} incoming mails today`);

    if(totalIncomingToday >= (alias.user.maxIncomingPerDay||parseInt(env.defaultIncomingQuotaPerDay))) {
        console.log("[NormalAlias] REJECT: Incoming Quota exceeded");
        message.setReject(`Mailbox has exceeded incoming quota. Try again tomorrow.`);
        return true;
    }

	// Modify headers so it comes from the alias and replies go to the reverse alias
	mailContent = setHeader(mailContent, "From", (alias.remoteNameOverwriteOnIncoming||from.name) + " <" + alias.token + "@" + alias.domain + ">");
	mailContent = setHeader(mailContent, "To", alias.destination.mailName + " <" + alias.destination.mailBox + "@" + alias.destination.mailDomain + ">");
	mailContent = setHeader(mailContent, "Reply-To", from.name + " <" + reverseAlias.token + "-" + alias.token + "@" + alias.domain + ">");
	mailContent = setHeader(mailContent, "Sender", from.raw);
	console.log("[NormalAlias] Modified headers!");

	// Remove invalid headers
	mailContent = removeHeadersExcept(mailContent, TrustedHeaders);
	console.log("[NormalAlias] Removed all untrusted headers!");

	// Send mail
	await sendRawMail(mailContent, env, message);
	console.log(`[NormalAlias] Redirected to Destination(${alias.destination.id})!`);

	// Update quota for reverse alias
	await db
		.insertInto("reverseAliasQuota")
		.values({
			date: new Date().toDateString().slice(0, 10),
			reverseAliasID: reverseAlias.id,
			incomingMailCount: 1
		})
		.onConflict(oc => oc
			.columns(['date', 'reverseAliasID'])
			.doUpdateSet(eb => ({
				incomingMailCount: eb('incomingMailCount', '+', 1)
			}))
		)
		.execute();
	console.log(`[NormalAlias] Adjusted Quota of User(${alias.user.id})!`);
	
	return true;
}