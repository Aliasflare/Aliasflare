import { EmailMessage } from "cloudflare:email";
import { getHeader, parseAddressField } from "./MailHeaders";

export async function sendRawMailViaCloudflare(mailContent: string, env: any, message?: any) {
	const from = parseAddressField(getHeader(mailContent, "From"))?.email;
	if(!from) throw new Error("No from address at sendRawMail!");
	const to = parseAddressField(getHeader(mailContent, "To"))?.email;
	if(!to) throw new Error("No to address at sendRawMail!");
    console.log("[sendRawMail]", `Sending mail with ${mailContent.length} charcters to '${to}'`);

	// Put mail into cloudflare mail object
	const outgoingMessage = new EmailMessage(
		from,
		to,
		mailContent
	);

	//Send mail
	try {
		await env.email.send(outgoingMessage);
	} catch(err) {
		console.log("[sendRawMail]", "Failed to send mail:");
		console.error("[sendRawMail]" ,"Error:", err);
		if(message) message.setReject("Delivery failed");
		return false;
	}

	console.log("[sendRawMail] Mail sent successfully!");
	return true;
}

export async function sendRawMailViaMailgun(mailContent: string, env: any, message?: any) {
	const to = parseAddressField(getHeader(mailContent, "To"))?.email;
	if(!to) throw new Error("No to address at sendRawMail!");
    console.log("[sendRawMail]", `Sending mail with ${mailContent.length} charcters to '${to}'`);

    // Put mail into form
	const form = new FormData();
	form.append('to', to);
	form.append('message', new Blob([mailContent], { type: 'message/rfc822' }));
	console.log("[sendRawMail] Form built!");

	// Send mail
    const apiURL = `https://api.eu.mailgun.net/v3/${env.domain}/messages.mime`;
	console.log("[sendRawMail]", `Sending using url '${apiURL}'...`);
	const sendRes = await fetch(apiURL, {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + btoa("api:" + env.mailgun),
		},
		body: form
	});

	if(sendRes.status != 200) {
        console.log("[sendRawMail]", "Failed to send mail:");
		console.error("[sendRawMail]" ,"Error Code:", sendRes.status);
		console.error("[sendRawMail]", "Error Message:", await sendRes.text());
		if(message) message.setReject("Delivery failed");
		return false;
	}

	console.log("[sendRawMail] Mail sent successfully!");
	return true;
}