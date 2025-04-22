import { db } from "../../database/D1DB";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodUUID, ZodBoolean, ZodJSONObject } from "../../utils/Validators";
import { z } from "zod";

export const ZodGetUserBody = (request: ExtendedRequest, env: Env) => z
.object({
    self: ZodBoolean.optional(),
    id: ZodUUID.optional()
})
.refine(a => a.self||a.id, "Must specify either id or self")
.refine(a => a.self == undefined || request.user, "Must be signed in to operate on self")
.transform(a => ({ id: a.id||request.user?.id as string, self: a.self }))
.refine(a => a.id == request.user?.id || request.isAdmin, "Must be admin to operate on other users")

export async function GetUser(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const parsedBody = await ZodGetUserBody(request, env).safeParseAsync(rawBody.data);
        if(parsedBody.error) return InvalidBodyError(parsedBody.error.issues);

        //Check if users exists
        const user = await db
            .selectFrom("user")
            .selectAll()
            .where("id", "==", parsedBody.data.id)
            .limit(1)
            .executeTakeFirst();
        if(!user) return TargetNotFoundError("user");
		return Response.json({ error: false, user: { ...user, passwordHash: undefined, passwordSalt: undefined } });
	}
}