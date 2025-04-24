import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodBoolean, ZodString } from "../../validators/BasicValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodValidDomain } from "../../validators/MailValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const AliasCreateBody = (request: ExtendedRequest, env: any) => z.object({
    aliasCategory: ZodAccessibleObjectFromTable("aliasCategory", "id")(request.user?.id, request.isAdmin).optional(),
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin).optional(),
    domain: ZodValidDomain(env),
    displayColor: ZodDisplayColor,
    displayIcon: ZodDisplayIcon,
    displayName: ZodDisplayName,
    remoteNameOverwriteOnIncoming: ZodString.optional(),
    remoteNameOverwriteOnOutgoing: ZodString.optional(),
    ownNameOverwriteOnOutgoing: ZodString.optional(),
    enabled: ZodBoolean.optional()
}).readonly();

export async function AliasCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await AliasCreateBody(request,env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        //Insert alias
        const insertedAlias = (await db
            .insertInto("alias")
            .values({
                userID: request.user.id,
                ...createBody.data
            })
            .returningAll()
            .execute())[0];

        console.log("[AliasCreate]", `Created new Alias(${insertedAlias.id}) for Destination(${createBody.data.destination?.id})`);
        return Response.json({ error: false, aliasID: insertedAlias.id });
    }
}