import { EndpointNotFoundError } from "./Errors";
import { ExtendedRequest } from "./ExtendedRequest";

export async function GenericApi(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/"))
		return EndpointNotFoundError();
}