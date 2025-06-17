import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodBoolean, ZodEmptyString, ZodString } from "../../validators/BasicValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayImage, ZodDisplayName, ZodDisplayURL } from "../../validators/DisplayValidators";
import { TransformAlias } from "./AliasTransformer";

const AliasUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    alias: ZodAccessibleObjectFromTable("alias", "id")(request.user?.id, request.isAdmin),
    categoryID: z.union([ZodAccessibleObjectFromTable("category", "id")(request.user?.id, request.isAdmin), ZodEmptyString]).optional(),
    destinationID: z.union([ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin), ZodEmptyString]).optional(),
    displayColor: ZodDisplayColor,
    displayIcon: ZodDisplayIcon,
    displayName: ZodDisplayName,
    displayURL: ZodDisplayURL,
    displayImage: ZodDisplayImage,
    remoteNameOverwriteOnIncoming: ZodString.optional(),
    remoteNameOverwriteOnOutgoing: ZodString.optional(),
    ownNameOverwriteOnOutgoing: ZodString.optional(),
    enabled: ZodBoolean.optional()
}).readonly();

export async function AliasUpdate(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await AliasUpdateBody(request, env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);
        if(Object.keys(updateBody.data).length < 2) return InvalidBodyError("At least one field has to be updated!");

        const updated = await db
            .updateTable("alias")
            .where("id", "==", updateBody.data.alias.id)
            .set({
                ...updateBody.data,
                ...updateBody.data.categoryID !== undefined ? { categoryID: updateBody.data.categoryID?.id||null } : {},
                ...updateBody.data.destinationID !== undefined ? { destinationID: updateBody.data.destinationID?.id||null } : {},
                //@ts-expect-error
                alias: undefined,
                category: undefined,
                destination: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        console.log("[AliasUpdate]", `Updated Alias(${updated.id})`);
        return Response.json({ error: false, alias: TransformAlias(updated) });
    }
}