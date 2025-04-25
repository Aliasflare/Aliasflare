import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { AuthLogout } from "../auth/AuthLogout";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const UserDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin)
});

export async function UserDelete(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const deletBody = await UserDeleteBody(request, env).safeParseAsync(body.data);
        if(deletBody.error) return InvalidBodyError(deletBody.error.issues);

        //TODO: Keep anonymized audit logs for deletions (e.g. to comply with law enforcements request)
       
        await db
            .deleteFrom("user")
            .where("id", "==", deletBody.data.user.id as any)
            .executeTakeFirst();

        await AuthLogout(request, env);

        console.log("[UserDelete]", `Deleted User(${deletBody.data.user.id})`);
        return Response.json({ error: false });
    }
}