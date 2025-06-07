import { streamToString } from "../utils/Streams";
import { getHeader, parseAddressField, unfoldHeaders } from "../utils/MailHeaders";
import { initDB } from "../Database";
import { initCloudflareClient } from "../CloudflareClient";
import { ReverseAlias } from "./ReverseAlias";
import { NormalAlias } from "./NormalAlias";

export async function EmailHandler(message: any, env: any, ctx: any) {
	await initDB(env.D1);
	await initCloudflareClient(env);

	const data:any = new Object();
	// Recieve entire mail
	let mailContent = await streamToString(message.raw);
	console.log("[EmailHandler] Read mail with", mailContent.length, "characters!");
	mailContent = unfoldHeaders(mailContent);
	console.log("[EmailHandler] Unfolded headers!");

	//Parse from/to headers
	data.from = parseAddressField(getHeader(mailContent, "From"));
	data.to = parseAddressField(getHeader(mailContent, "To"));
	if(!data.from || !data.to) {
		console.warn("[EmailHandler]", `Rejected mail with invalid from/to headers!`);
		message.setReject(`From/To Headers are malformed`);
		return;
	}
	console.info("[EmailHandler]", `Handling mail from '${data.from.email}' to '${data.to.email}'`);

	//Handle
	console.log("[EmailHandler]", "Executing handler 'ReverseAlias'");
	if(await ReverseAlias(message, env, mailContent, data)) return;
	console.log("[EmailHandler]", "Skipped handler 'ReverseAlias'");
	console.log("[EmailHandler]", "Executing handler 'NormalAlias'");
	if(await NormalAlias(message, env, mailContent, data)) return;
	console.log("[EmailHandler]", "Skipped handler 'NormalAlias'");

	//Error if no handler returned true (handled the mail)
	console.error("[EmailHandler]", `No handler handled the mail?`);
	message.setReject("Internal server error");
}