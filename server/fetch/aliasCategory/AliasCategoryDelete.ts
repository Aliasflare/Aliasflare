import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const AliasCategoryDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    aliasCategory: ZodAccessibleObjectFromTable("aliasCategory", "id")(request.user?.id, request.isAdmin)
});

export async function AliasCategoryDelete(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/aliasCategory/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const deleteBody = await AliasCategoryDeleteBody(request, env).safeParseAsync(body.data);
        if(deleteBody.error) return InvalidBodyError(deleteBody.error.issues);

        await db
            .deleteFrom("aliasCategory")
            .where("id", "==", deleteBody.data.aliasCategory.id)
            .executeTakeFirst();

        console.log("[AliasCategoryDelete]", `Deleted AliasCategory(${deleteBody.data.aliasCategory.id})`);    
        return Response.json({ error: false });
    }
}