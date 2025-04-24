import { z } from "zod";
import { db } from "../../Database";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";

const AliasGetBody = (request: ExtendedRequest, env: Env) => z.object({
    alias: ZodAccessibleObjectFromTable("alias", "id")(request.user?.id, request.isAdmin)
});

export async function AliasGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await AliasGetBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);
        
        return Response.json({ error: false, alias: getBody.data.alias });
    }
}