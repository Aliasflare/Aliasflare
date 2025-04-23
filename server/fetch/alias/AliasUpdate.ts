import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodBoolean, ZodJSONObject, ZodMailAddress, ZodMailName, ZodString } from "../../utils/Validators";
import { z } from "zod";
import { ZodAliasGetBody } from "./AliasGet";

export const ZodUpdateAliasBody = (request: ExtendedRequest, env: Env) => z
.object({
    destinationMail: ZodMailAddress.optional(),
    destinationName: ZodMailName.optional(),
    friendlyName: ZodString.optional(),
    enabled: ZodBoolean.optional()
});

const RefinedZodUpdateAliasBody = (request: ExtendedRequest, env: Env) => ZodUpdateAliasBody(request, env)
.refine(a => Object.keys(a).length > 0, "Must contain at least one update field");

export async function AliasUpdate(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const aliasBody = await ZodAliasGetBody.safeParseAsync(rawBody.data);
        if(aliasBody.error) return InvalidBodyError(aliasBody.error.issues);

        const updateBody = await RefinedZodUpdateAliasBody(request, env).safeParseAsync(rawBody.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);

        //Update fields
        const updateResult = await db
            .updateTable("alias")
            .where("id", "==", aliasBody.data.id)
            .set({
                ...updateBody.data.destinationMail != undefined ? { destinationMail: updateBody.data.destinationMail } : {},
                ...updateBody.data.destinationName != undefined ? { destinationName: updateBody.data.destinationName } : {},
                ...updateBody.data.friendlyName != undefined ? { friendlyName: updateBody.data.friendlyName } : {},
                ...updateBody.data.enabled != undefined ? { enabled: updateBody.data.enabled } : {},
            })
            .executeTakeFirst();
        if(updateResult.numUpdatedRows == BigInt(0)) return TargetNotFoundError("alias");

        console.log("[UpdateAlias]", `Updated alias with id '${aliasBody.data.id}'`);
        return Response.json({ error: false, aliasID: aliasBody.data.id });
    }
}