import { db } from "../Database";
import { getHeader, TrustedHeaders, removeHeadersExcept, parseAddressField, setHeader } from "../utils/MailHeaders";
import { sendRawMail } from "../utils/MailSend";

export async function NormalAlias(message: any, env: any, mailContent: string, data: any) {
	if(!db) throw new Error("Database error");

	//Parse to/from
	const to = parseAddressField(getHeader(mailContent, "To"));
	const from = parseAddressField(getHeader(mailContent, "From"));
	if(!to || !from) throw new Error("Malformed to/from header");

	//Ensure alias exists
	const alias = await db
		.selectFrom("alias")
		.selectAll()
		.where("id", "==", to.mailbox)
		.where("domain", "==", to.domain)
		.limit(1)
		.executeTakeFirst();

	if(!alias) {
		console.warn("[NormalAlias]", `Rejected mail to unknown alias '${to.raw}' from '${from.raw}`);
		message.setReject(`Mailbox "${to.mailbox}" does not exist`);
		return true;
	} else console.log("[NormalAlias]", `Found alias '${alias.id}' to '${alias.destinationMail}'`);

	//Only accept mails if alias is enabled
	if(!alias.enabled) {
		console.warn("[NormalAlias]", `Rejected mail to disabled alias '${to.raw}' from '${from.raw}`);
		message.setReject(`Mailbox "${to.mailbox}" is disabled`);
		return true;
	}

	// Find or create the senders reverse-alias
	let reverseAlias = await db
		.selectFrom("reverseAlias")
		.selectAll()
		.where("aliasID", "==", alias.id)
		.where("destinationMail", "==", from.email)
		.where("destinationName", "==", from.name)
		.limit(1)
		.executeTakeFirst();

	//Create reverse alias if it doesnt exist
	if(!reverseAlias) {
		let reverseAliasID = crypto.randomUUID().slice(0, 24).replaceAll("-", "");
        while(await db.selectFrom("reservedAddress").selectAll().where("mailbox", "==", alias.id + "-" + reverseAliasID).executeTakeFirst()) {
            console.log("[NormalAlias]", `Skipping already used address '${reverseAliasID + "-" + reverseAliasID}`);
            reverseAliasID = crypto.randomUUID().slice(0, 24).replaceAll("-", "");
        }

		reverseAlias = await db
			.insertInto("reverseAlias")
			.returningAll()
			.values({
				id: reverseAliasID,
				alias: alias.id,
				destinationMail: from.email,
				destinationName: from.name,
			})
			.executeTakeFirstOrThrow();
		console.log(`[NormalAlias] Generated reverse-alias '${reverseAliasID}' for '${from.raw}'!`);
	} else console.log(`[NormalAlias] Found reverse-alias '${reverseAlias.id}' for '${from.raw}'!`);

    //Ensure alias owner has incoming quota
    const user = await db
        .selectFrom("user")
        .selectAll()
        .where("id", "==", alias.user)
        .limit(1)
        .executeTakeFirstOrThrow();
    if(!user) throw new Error("Alias user not found");

    const totalIncomingToday = (await db
        .selectFrom("alias")
        .where("user", "==", alias.user)
        .leftJoin("reverseAliasQuota", join => join.on("reverseAliasQuota.alias", "=", "alias.id"))
		.where("reverseAliasQuota.date", "==", new Date().toISOString().slice(0, 10))
        .select(({fn}) => fn.sum("reverseAliasQuota.incomingMailCount").as("count"))
        .executeTakeFirst())?.count as number|null || 0;

    if(totalIncomingToday >= (user.maxIncomingPerDay||env.defaultIncomingQuotaPerDay)) {
        console.log("[NormalAlias] Rejecting because user incoming quota is exceeded!");
        message.setReject(`Mailbox has exceeded incoming quota. Try again tomorrow.`);
        return true;
    }

	// Modify mail so it comes from us
	mailContent = setHeader(mailContent, "From", (alias.remoteNameOverwriteOnIncoming||from.name) + " <" + alias.id + "@" + alias.domain + ">");
	mailContent = setHeader(mailContent, "To", alias.destinationName + " <" + alias.destinationMail + ">");
	mailContent = setHeader(mailContent, "Reply-To", from.name + " <" + reverseAlias.id + "-" + alias.id + "@" + alias.domain + ">");
	mailContent = setHeader(mailContent, "Sender", from.raw);
	console.log("[NormalAlias] Modified headers!");

	// Remove invalid headers
	mailContent = removeHeadersExcept(mailContent, TrustedHeaders);
	console.log("[NormalAlias] Removed all untrusted headers!");

	// Send mail
	await sendRawMail(mailContent, env, message);

	//Save that mail has been sent
	await db.updateTable("alias")
		.where("id", "==", alias.id)
		.set({
			lastMailAt: new Date().toISOString()
		})
		.execute();

	//Increase incoming quota on reverse-alias (insert or update)
	await db
		.insertInto("reverseAliasQuota")
		.values({
			date: new Date().toDateString().slice(0, 10),
			reverseAlias: reverseAlias.id,
			alias: reverseAlias.alias,
			incomingMailCount: 1
		})
		.onConflict(oc => oc
			.columns(['date', 'alias', 'reverseAlias'])
			.doUpdateSet(eb => ({
				incomingMailCount: eb('incomingMailCount', '+', 1)
			}))
		)
		.execute();

	return true;
}