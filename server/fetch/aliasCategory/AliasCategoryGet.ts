import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { TransformAliasCategory } from "./AliasCategoryTransformer";

const AliasCategoryGetBody = (request: ExtendedRequest, env: Env) => z.object({
    aliasCategory: ZodAccessibleObjectFromTable("aliasCategory", "id")(request.user?.id, request.isAdmin)
});

export async function AliasCategoryGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/aliasCagetory/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await AliasCategoryGetBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);
        
        console.log("[AliasCategoryGet]", `Get AliasCategory(${getBody.data.aliasCategory.id})`);
        return Response.json({ error: false, aliasCategory: TransformAliasCategory(getBody.data.aliasCategory) });
    }
}