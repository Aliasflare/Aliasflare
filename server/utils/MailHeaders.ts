export const TrustedHeaders = [
    'From',
    'To',
    'Cc',
    'Bcc',
    'Subject',
    'Date',
    'Message-ID',
    'Reply-To',
    'In-Reply-To',
    'References',
    'From',
    'To',
    'Cc',
    'Bcc',
    'Subject',
    'Date',
    'Message-ID',
    'Reply-To',
    'In-Reply-To',
    'References',
    'MIME-Version',
    'Content-Type',
    'Content-Disposition',
    'Content-Transfer-Encoding',
    'MIME-Version',
    'Sender'
];

export function splitEmail(rawEmail: string) {
	const [headerPart, ...rest] = rawEmail.split(/\r?\n\r?\n/);
	const remaining = rest.join("\n\n").trim();
	return [headerPart.trim(), remaining];
}

export function unfoldHeaders(rawEmail: string) {
	const [header, body] = splitEmail(rawEmail);
	const headerLines = header.split('\n');
	const unfoldedLines = [];
	let buffer = "";
	for (let headerLine of headerLines) {
		if (/^\s/.test(headerLine)) buffer += headerLine.replace(/^\s+/, ' ');
		else {
			if (buffer) unfoldedLines.push(buffer);
			buffer = headerLine;
		}
	}
	if (buffer) unfoldedLines.push(buffer);
	return unfoldedLines.join("\n") + "\n\n" + body;
}

export function getHeaderNames(rawEmail: string) {
	const pattern = /^([a-zA-Z0-9-]+):/gm;
	const headers = [];
	let match;
	while ((match = pattern.exec(rawEmail)) !== null)
        headers.push(match[1]);
	return headers;
}

export function setHeader(rawEmail: string, headerName: string, value: any) {
	const [header, body] = splitEmail(rawEmail);
	const headerLines = header.split('\n');
	for(const [lineNumber, headerLine] of Object.entries(headerLines)) {
		const isTargetHeader = headerLine.toLowerCase().startsWith(headerName.toLowerCase() + ':');
		if(!isTargetHeader) continue;
		if(value == undefined) {
			console.log("[Headers]", `Removed header '${headerName}' at line ${lineNumber}`);
			headerLines.splice(parseInt(lineNumber), 1); //Remove line
		} else {
			console.log("[Headers]", `Updated header '${headerName}' at line ${lineNumber}`);
			headerLines[parseInt(lineNumber)] = headerName + ": " + value; //Replace line
		}
		return headerLines.join('\n') + "\n\n" + body;
	}

	//Not found
	if(value == undefined) {
        console.warn("[Headers]", `Header '${headerName}' cannot be removed as it does not exist!`);
        return rawEmail;
    }
	console.log("[Headers]", `Added header '${headerName}' at end of headers`);
	return header + "\n" + headerName + ": " + value + "\n\n" + body;

}
  
export function getHeader(rawEmail: string, headerName: string) {
	const pattern = new RegExp(`^${headerName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}:\\s*(.*)$`, 'im');
	const match = rawEmail.match(pattern);
	return match ? match[1] : null;
}

export function removeHeadersExcept(mailContent: string, toKeep: string[]) {
    toKeep = toKeep.map(a => a.toLowerCase());
    const toRemoves = getHeaderNames(mailContent).filter(a => !toKeep.includes(a.toLowerCase()));
    for(const toRemove of toRemoves) mailContent = setHeader(mailContent, toRemove, undefined);
    console.log("[Headers] Removed", toRemoves.length, "headers!");
    return mailContent;
}

export function hasHeader(mailContent: string, headerName: string) {
    return getHeaderNames(mailContent).map(a => a.toLowerCase()).includes(headerName.toLowerCase());
}

export function parseAddressField(input?: string|null) {
    if(!input) throw new Error("Cannot parse empty address");
    const regex = /([a-zA-Z\s]+)?<([^>]+)>|([^<>\s]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = input.match(regex);
  
    if (match) {
      if (match[1]) {
        return { raw: input, name: match[1].trim(), email: match[2]?.toLowerCase(), mailbox: match[2]?.toLowerCase()?.split("@")[0], domain: match[2]?.toLowerCase()?.split("@")[1]  };
      } else if (match[3]) {
        return { raw: input, name: null, email: match[3]?.toLowerCase(), mailbox: match[3]?.toLowerCase()?.split("@")[0], domain: match[3]?.toLowerCase()?.split("@")[1] };
      }
    }
    return null;
}
