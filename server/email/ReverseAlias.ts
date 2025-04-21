import { db } from "../database/D1DB";
import { TrustedHeaders, removeHeadersExcept, parseAddressField, getHeader, setHeader } from "../utils/MailHeaders";
import { sendRawMail } from "../utils/MailSend";

export async function ReverseAlias(message: any, env: any, mailContent: string, data: any) {
	if(!db) throw new Error("Database error");

    //Parse to/from
    const to = parseAddressField(getHeader(mailContent, "To"));
    const from = parseAddressField(getHeader(mailContent, "From"));
    if(!to || !from) throw new Error("Malformed to/from header");

    //Check if format would match an alias (has an -)
    if(!to.mailbox.includes("-")) {
        console.log("[ReverseAlias]", "Mail is not an alias!");
        return false;
    }

    //Extract aliasMail and reverseAliasID
    const reverseAliasID = to.mailbox.split("-")[0];
    const aliasID = to.mailbox.split("-").slice(1).join("-");
    console.info("[ReverseAlias]", `Mail is probably going to reverse-alias '${reverseAliasID}' of alias '${aliasID}'`);

    //Check if the alias exists
    const alias = await db
        .selectFrom("alias")
        .selectAll()
        .where("id", "==", aliasID)
        .where("domain", "==", to.domain)
        .limit(1)
        .executeTakeFirst();
        
    if(!alias) {
        console.log("[ReverseAlias]", "Alias not found!");
        return false;
    } else console.log("[ReverseAlias]", `Found alias '${alias.id}' to '${alias.destinationMail}'`);

    //Only accept mails if alias is enabled
	if(!alias.enabled) {
		console.warn("[ReverseAlias]", `Rejected reverse-mail to disabled alias '${to.raw}' from '${from.raw}`);
		message.setReject(`Mailbox "${to.mailbox}" is disabled`);
		return true;
	}

    //Check if the reverse alias exists
    const reverseAlias = await db
        .selectFrom("reverseAlias")
        .selectAll()
        .where("id", "==", reverseAliasID)
        .where("alias", "==", alias.id)
        .limit(1)
        .executeTakeFirst();

    if(!reverseAlias) {
        console.log("[ReverseAlias]", "Reverse Alias not found on Alias!");
        return false;
    } else console.log(`[ReverseAlias] Found reverse-alias '${reverseAlias.id}' for '${reverseAlias.destinationMail}'!`);

    //Rewrite headers so no data is leaked
    mailContent = setHeader(mailContent, "From", (alias.ownNameOverwriteOnOutgoing||from.name) + " <" + alias.id + "@" + env.domain + ">");
    mailContent = setHeader(mailContent, "To", (alias.remoteNameOverwriteOnOutgoing||to.name) + " <" + reverseAlias.destinationMail + ">");
    mailContent = setHeader(mailContent, "Reply-To", getHeader(mailContent, "From"));
    console.log("[ReverseAlias] Modified headers!");

	// Remove invalid headers
	mailContent = removeHeadersExcept(mailContent, TrustedHeaders);
	console.log("[ReverseAlias] Removed all untrusted headers!");

	//Save that mail has been sent
	await db.updateTable("reverseAlias")
		.where("id", "==", reverseAlias.id)
        .where("alias", "==", alias.id)
		.set({ lastMailAt: new Date().toISOString() })
		.execute();

    //Send mail
    await sendRawMail(mailContent, env, message);
    return true;
}