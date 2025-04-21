import { db } from "../database/D1DB";
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

	// Find or create the senders reverse-alias
	let reverseAlias = await db
		.selectFrom("reverseAlias")
		.selectAll()
		.where("alias", "==", alias.id)
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

	return true;
}