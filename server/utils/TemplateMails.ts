export function BuildDestinationVerifiedMail(destination: any, domain: any) {
const m = 
`From: <noreply@${domain}>
To: <${destination.mailBox}@${destination.mailDomain}>
Subject: Destination (${destination.mailBox}@${destination.mailDomain}) verified
Date: ${new Date().toUTCString()}
Message-ID: <confirm.${Date.now()}@${domain}>

Hey, we're reaching out with great news!

✅ This destination '${destination.mailBox}@${destination.mailDomain}' has been successfully verified!
📨 You can now redirect incoming emails to this address.

➕ Your first incoming email should already be in your inbox!
(We validate destinations using their first incoming message.)

Best regards`;
return m;
}

export function BuildDestinationRemovedMail(destination: any, domain: any) {
const m = 
`From: <noreply@${domain}>
To: <${destination.mailBox}@${destination.mailDomain}>
Subject: Destination (${destination.mailBox}@${destination.mailDomain}) removed
Date: ${new Date().toUTCString()}
Message-ID: <confirm.${Date.now()}@${domain}>

Hey, we're reaching out with some news!

🗑️ This destination '${destination.mailBox}@${destination.mailDomain}' has been removed!
❌ You can no long redirect incoming emails to this address.
⚠️ All aliases using this destination will not work anymore and reject incoming mails!
🔧 Change the destination for affected aliases to start recieve mails again.

Best regards`;
return m;
}

