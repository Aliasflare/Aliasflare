import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodMailBox, ZodMailName, ZodMailValidDomain } from "../../validators/MailValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";

const DestinationCreateBody = (request: ExtendedRequest, env: any) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    mailName: ZodMailName,
    mailBox: ZodMailBox,
    mailDomain: ZodMailValidDomain(env),
    enabled: ZodBoolean.optional(),
    verified: ZodBoolean.refine(a => request.isAdmin, "Must be admin to set verfied").default(Boolean(env.disableDomainVerfication)).optional(),
}).readonly();

export async function DestinationCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await DestinationCreateBody(request,env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        const inserted = await db
            .insertInto("destination")
            .values({
                ...createBody.data,
                userID: createBody.data.user.id,
            })
            .returningAll()
            .executeTakeFirstOrThrow()

        //TODO: Send confirmation mail if not verified automatically

        console.log("[DestinationCreate]", `Created new Destination(${inserted.id})`);
        return Response.json({ error: false, destination: { ...inserted, verifyToken: undefined } });
    }
}