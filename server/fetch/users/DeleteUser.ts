import { db } from "../../database/D1DB";
import { InvalidBodyError, InvalidMethodError, InvalidOperationError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodJSONObject } from "../../utils/Validators";
import { AuthLogout } from "../auth/AuthLogout";
import { ZodGetUserBody } from "./GetUser";

export async function DeleteUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const userBody = await ZodGetUserBody(request, env).safeParseAsync(rawBody.data);
        if(userBody.error) return InvalidBodyError(userBody.error.issues);

        //TODO: Keep anonymized audit logs for deletions (e.g. to comply with law enforcements request)
        //Delete user account (all others deletes are managed by the database)
        const deleteRes = await db
            .deleteFrom("user")
            .where("id", "==", userBody.data.id as any)
            .executeTakeFirst();
        if(deleteRes.numDeletedRows == BigInt(0)) return TargetNotFoundError("user");

        await AuthLogout(request, env);
        return Response.json({ error: false });
    }
}