import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";
import { TransformAliasCategory } from "./AliasCategoryTransformer";

const AliasCategoryCreateBody = (request: ExtendedRequest, env: any) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    enabled: ZodBoolean.optional(),
}).readonly();

export async function AliasCategoryCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/aliasCategory/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await AliasCategoryCreateBody(request,env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        const inserted = await db
            .insertInto("aliasCategory")
            .values({
                ...createBody.data,
                userID: createBody.data.user.id,
                //@ts-expect-error
                user: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow()

        //TODO: Send confirmation mail if not verified automatically

        console.log("[AliasCategoryCreate]", `Created new AliasCategory(${inserted.id})`);
        return Response.json({ error: false, aliasCategory: TransformAliasCategory(inserted) });
    }
}