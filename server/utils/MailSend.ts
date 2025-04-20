import { getHeader, parseAddressField } from "./MailHeaders";

export async function sendRawMail(mailContent: string, env: any, message: any) {
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
		message.setReject("Delivery failed");
		return false;
	}

	console.log("[sendRawMail] Mail sent successfully!");
}