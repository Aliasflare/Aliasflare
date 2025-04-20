export async function streamToString(stream: any) {
	const reader = stream.getReader();
	const chunks = [];
	while (true) {
	  const { done, value } = await reader.read();
	  if (done) break;
	  chunks.push(new TextDecoder().decode(value));
	}
	return chunks.join('');
}