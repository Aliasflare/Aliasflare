import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { AuthLogout } from "../auth/AuthLogout";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const DeleteUserBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin)
});

export async function DeleteUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const userBody = await DeleteUserBody(request, env).safeParseAsync(body.data);
        if(userBody.error) return InvalidBodyError(userBody.error.issues);

        //TODO: Keep anonymized audit logs for deletions (e.g. to comply with law enforcements request)
        //Delete user account (all others deletes are managed by the database)
        const deleteRes = await db
            .deleteFrom("user")
            .where("id", "==", userBody.data.user.id as any)
            .executeTakeFirst();
        if(deleteRes.numDeletedRows == BigInt(0)) return TargetNotFoundError("user");

        await AuthLogout(request, env);
        return Response.json({ error: false });
    }
}