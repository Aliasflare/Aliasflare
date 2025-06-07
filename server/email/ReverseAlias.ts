import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { db, aliasCategoryColumns, userColumns } from "../Database";
import { TrustedHeaders, removeHeadersExcept, parseAddressField, getHeader, setHeader, hasHeader } from "../utils/MailHeaders";
import { sendRawMailViaMailgun } from "../utils/MailSend";

export async function ReverseAlias(message: any, env: any, mailContent: string, data: any) {
	if(!db) throw new Error("Database error");

    //Parse to/from
    const to = parseAddressField(getHeader(mailContent, "To"));
    const from = parseAddressField(getHeader(mailContent, "From"));
    if(!to || !from) throw new Error("Malformed to/from header");

    //Check if format would match an alias (has an -)
    if(!to.mailbox.includes("-")) {
        console.log("[ReverseAlias]", "Mail is not an Alias");
        return false;
    }

    //Extract aliasMail and reverseAliasID
    const reverseAliasID = to.mailbox.split("-")[0];
    const aliasID = to.mailbox.split("-").slice(1).join("-");
    console.info("[ReverseAlias]", `Mail is probably going to ReverseAlias '${reverseAliasID}' of Alias '${aliasID}'`);

    // Grab alias
    const alias = await db
        .selectFrom("alias")
        .selectAll()
        .where("token", "==", aliasID)
        .where("domain", "==", to.domain)
        .select((eb) => [
            jsonObjectFrom(
                eb
                .selectFrom("aliasCategory")
                .select(aliasCategoryColumns)
                .whereRef("aliasCategory.id", "=", "alias.aliasCategoryID")
            ).as("aliasCategory"),
            jsonObjectFrom(
                eb
                .selectFrom("user")
                .select(userColumns)
                .whereRef("user.id", "=", "alias.userID")
            ).as("user")
        ])
        .limit(1)
        .executeTakeFirst();
        
    // Ensure alias and its fields exists
    if(!alias) {
        console.warn("[ReverseAlias]", `REJECT: Alias '${to.mailbox}' not found`);
        message.setReject(`Mailbox "${to.mailbox}" does not exist`);
        return true;
    }
    console.log("[ReverseAlias]", `Mail goes to Alias(${alias.id})`);

    if(!alias.user) {
        console.warn("[ReverseAlias]", `REJECT: Alias has no User`);
        console.error("[ReverseAlias]", "THIS IS A DATABASE ERROR! THERE SHOULD NEVER BE UNREACHABLE ALIASES WITHOUT USERS!");
        message.setReject(`Mailbox "${to.mailbox}" permanently unavailable`);
        return true;
    }
    console.log("[ReverseAlias]", `Alias(${alias.id}) has User(${alias.user.id})`);

    // Ensure alias and his category is enabled
    if(!alias.enabled) {
        console.warn("[ReverseAlias]", `REJECT: Alias is disabled`);
        message.setReject(`Mailbox "${to.mailbox}" is disabled`);
        return true;
    }

    if(alias.aliasCategory && !alias.aliasCategory.enabled) {
        console.warn("[ReverseAlias]", `REJECT: Aliases Category is disabled`);
        message.setReject(`Mailbox "${to.mailbox}" is disabled`);
        return true;
    }

    // Ensure reverse alias exists
    const reverseAlias = await db
        .selectFrom("reverseAlias")
        .selectAll()
        .where("aliasID", "==", alias.id)
        .where("token", "==", reverseAliasID)
        .limit(1)
        .executeTakeFirst();

    if(!reverseAlias) {
        console.log("[ReverseAlias]", `ReverseAlias '${reverseAliasID}' not found on Alias(${alias.id})!`);
        return false;
    }
    console.log(`[ReverseAlias] Mail goes to ReverseAlias(${reverseAlias.id})`);

    // Ensure alias owner has incoming quota
    const totalOutgoingToday = (await db
        .selectFrom("alias")
        .where("userID", "==", alias.user.id)
        .leftJoin("reverseAlias", join => join.on("reverseAlias.aliasID", "=", "alias.id"))
        .leftJoin("reverseAliasQuota", join => join.on("reverseAliasQuota.reverseAliasID", "=", "reverseAlias.id"))
        .where("reverseAliasQuota.date", "==", new Date().toISOString().slice(0, 10))
        .select(({fn}) => fn.sum("reverseAliasQuota.outgoingMailCount").as("count"))
        .executeTakeFirst())?.count as number|null || 0;
    console.log(`[ReverseAlias] User(${alias.user.id}) had ${totalOutgoingToday} outgoing mails today`);

    if(totalOutgoingToday >= (alias.user.maxOutgoingPerDay||parseInt(env.defaultOutgoingQuotaPerDay))) {
        console.log("[ReverseAlias] REJECT: Outgoing Quota exceeded");
        message.setReject(`Mailbox has exceeded outgoing quota. Try again tomorrow.`);
        return true;
    }

	// Modify headers so it comes from the alias and replies go to the alias
    mailContent = setHeader(mailContent, "From", (alias.ownNameOverwriteOnOutgoing||from.name) + " <" + alias.token + "@" + alias.domain + ">");
    mailContent = setHeader(mailContent, "To", (alias.remoteNameOverwriteOnOutgoing||to.name) + " <" + reverseAlias.destinationMail + ">");
    mailContent = setHeader(mailContent, "Reply-To", getHeader(mailContent, "From"));
	if(hasHeader(mailContent, "Message-ID")) mailContent = setHeader(mailContent, "Message-ID", getHeader(mailContent, "Message-ID")?.replaceAll(from.domain, alias.domain));
    if(hasHeader(mailContent, "References-ID")) mailContent = setHeader(mailContent, "References", getHeader(mailContent, "References")?.replaceAll(from.domain, alias.domain));
    if(hasHeader(mailContent, "In-Reply-To")) mailContent = setHeader(mailContent, "In-Reply-To", getHeader(mailContent, "In-Reply-To")?.replaceAll(from.domain, alias.domain));
    console.log("[ReverseAlias] Modified headers!");

	// Remove invalid headers
	mailContent = removeHeadersExcept(mailContent, TrustedHeaders);
	console.log("[ReverseAlias] Removed all untrusted headers!");

	// Send mail
	await sendRawMailViaMailgun(mailContent, env, message);
	console.log(`[ReverseAlias] Redirected to ReverseAlias(${reverseAlias.id})!`);

	// Update quota for reverse alias
	await db
		.insertInto("reverseAliasQuota")
		.values({
			date: new Date().toDateString().slice(0, 10),
			reverseAliasID: reverseAlias.id,
			outgoingMailCount: 1
		})
		.onConflict(oc => oc
			.columns(['date', 'reverseAliasID'])
			.doUpdateSet(eb => ({
				outgoingMailCount: eb('outgoingMailCount', '+', 1)
			}))
		)
		.execute();
	console.log(`[ReverseAlias] Adjusted Quota of User(${alias.user.id})!`);

    return true;
}