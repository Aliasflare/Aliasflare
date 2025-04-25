import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";

const AliasCategoryUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    aliasCategory: ZodAccessibleObjectFromTable("aliasCategory", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    enabled: ZodBoolean.optional(),
}).readonly();

export async function AliasCategoryUpdate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/aliasCategory/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await AliasCategoryUpdateBody(request,env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);

        const updated = await db
            .updateTable("destination")
            .where("id", "==", updateBody.data.aliasCategory.id)
            .set({
                ...updateBody.data,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //TODO: Send confirmation mail if not verfieid and mail changed

        console.log("[AliasCategoryUpdate]", `Updated AliasCategory(${updated.id})`);
        return Response.json({ error: false, aliasCategory: { ...updated } });
    }
}