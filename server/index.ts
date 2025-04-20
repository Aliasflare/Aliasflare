import { FetchHandler } from "./fetch/FetchHandler";
import { EmailHandler } from "./email/EmailHandler";
export default {
	fetch: FetchHandler,
	email: EmailHandler
} satisfies ExportedHandler<Env>;