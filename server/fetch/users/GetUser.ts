import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const GetUserBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin)
});

export async function GetUser(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await GetUserBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);

        //Check if users exists
        const user = await db
            .selectFrom("user")
            .selectAll()
            .where("id", "==", getBody.data.user.id)
            .limit(1)
            .executeTakeFirst();
        if(!user) return TargetNotFoundError("user");
		return Response.json({ error: false, user: { ...user, passwordHash: undefined, passwordSalt: undefined } });
	}
}