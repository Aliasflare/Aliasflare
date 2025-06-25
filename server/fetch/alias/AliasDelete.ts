import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";

const AliasDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    alias: ZodAccessibleObjectFromTable("alias", "id")(request)
});

export async function AliasDelete(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const deleteBody = await AliasDeleteBody(request, env).safeParseAsync(body.data);
        if(deleteBody.error) return InvalidBodyError(deleteBody.error.issues);

        await db
            .deleteFrom("alias")
            .where("id", "==", deleteBody.data.alias.id)
            .executeTakeFirst();

        console.log("[AliasDelete]", `Deleted Alias(${deleteBody.data.alias.id})`);    
        return Response.json({ error: false });
    }
}