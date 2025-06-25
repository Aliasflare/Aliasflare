import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { TransformAlias } from "./AliasTransformer";

const AliasGetBody = (request: ExtendedRequest, env: Env) => z.object({
    alias: ZodAccessibleObjectFromTable("alias", "id")(request)
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
        
        console.log("[AliasGet]", `Get Alias(${getBody.data.alias.id})`);
        return Response.json({ error: false, alias: TransformAlias(getBody.data.alias) });
    }
}