import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean, ZodEmptyString, ZodString } from "../../validators/BasicValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodMailValidDomain } from "../../validators/MailValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayImage, ZodDisplayName, ZodDisplayURL } from "../../validators/DisplayValidators";
import { TransformAlias } from "./AliasTransformer";

const AliasCreateBody = (request: ExtendedRequest, env: any) => z.object({
    categoryID: z.union([ZodAccessibleObjectFromTable("category", "id")(request.user?.id, request.isAdmin), ZodEmptyString]).optional(),
    destinationID: z.union([ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin), ZodEmptyString]).optional(),
    domain: ZodMailValidDomain(env),
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

export async function AliasCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await AliasCreateBody(request,env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        const inserted = await db
            .insertInto("alias")
            .values({
                ...createBody.data,
                userID: request.user.id,
                ...createBody.data.categoryID !== undefined ? { categoryID: createBody.data.categoryID?.id||null } : {},
                ...createBody.data.destinationID !== undefined ? { destinationID: createBody.data.destinationID?.id||null } : {},
                //@ts-expect-error
                category: undefined,
                destination: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        console.log("[AliasCreate]", `Created new Alias(${inserted.id}) for Destination(${inserted.destinationID})`);
        return Response.json({ error: false, alias: TransformAlias(inserted) });
    }
}