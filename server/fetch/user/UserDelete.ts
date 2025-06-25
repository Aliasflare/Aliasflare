import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const UserDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request)
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

        await db
            .deleteFrom("user")
            .where("id", "==", deletBody.data.user.id as any)
            .executeTakeFirst();

        //Delete authKeyUser if we delete the beloging user
        if(request.authKeyUser?.id == deletBody.data.user.id) delete request.authKeyUser;

        console.log("[UserDelete]", `Deleted User(${deletBody.data.user.id})`);
        return Response.json({ error: false });
    }
}