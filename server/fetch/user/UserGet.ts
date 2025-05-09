import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { TransformUser } from "./UserTransformer";

const UserGetBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin)
});

export async function UserGet(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await UserGetBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);

        console.log("[UserGet]", `Get User(${getBody.data.user.id})`);
		return Response.json({ error: false, user: TransformUser(getBody.data.user) });
	}
}