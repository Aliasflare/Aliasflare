import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { AuthLogout } from "../auth/AuthLogout";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const DestinationDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin)
});

export async function DestinationDelete(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const deleteBody = await DestinationDeleteBody(request, env).safeParseAsync(body.data);
        if(deleteBody.error) return InvalidBodyError(deleteBody.error.issues);

        await db
            .deleteFrom("destination")
            .where("id", "==", deleteBody.data.destination.id)
            .executeTakeFirst();

        await AuthLogout(request, env);
        return Response.json({ error: false });
    }
}