import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";
import { ZodBoolean, ZodString } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const AliasUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    alias: ZodAccessibleObjectFromTable("alias", "id")(request.user?.id, request.isAdmin),
    aliasCategory: ZodAccessibleObjectFromTable("aliasCategory", "id")(request.user?.id, request.isAdmin).optional(),
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin).optional(),
    displayColor: ZodDisplayColor,
    displayIcon: ZodDisplayIcon,
    displayName: ZodDisplayName,
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

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await AliasUpdateBody(request, env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);

        //Update fields
        const updateResult = await db
            .updateTable("alias")
            .where("id", "==", updateBody.data.alias.id)
            .set(updateBody.data)
            .returningAll()
            .executeTakeFirst();

        console.log("[UpdateAlias]", `Updated alias with id '${updateBody.data.alias.id}'`);
        return Response.json({ error: false, alias: updateResult });
    }
}