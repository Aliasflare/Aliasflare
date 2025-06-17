import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean, ZodEmptyString } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodDomain, ZodMailBox, ZodMailName } from "../../validators/MailValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayImage, ZodDisplayName, ZodDisplayURL } from "../../validators/DisplayValidators";
import { TransformDestination } from "./DestinationTransformer";
import { cloudflareClient } from "../../CloudflareClient";

const DestinationCreateBody = (request: ExtendedRequest, env: any) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    categoryID: z.union([ZodAccessibleObjectFromTable("category", "id")(request.user?.id, request.isAdmin), ZodEmptyString]).optional(),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    displayURL: ZodDisplayURL,
    displayImage: ZodDisplayImage,
    mailName: z.union([ZodMailName, ZodEmptyString]).optional(),
    mailBox: ZodMailBox,
    mailDomain: ZodDomain,
    enabled: ZodBoolean.optional(),
    verified: ZodBoolean.refine(a => request.isAdmin, "Must be admin to set verfied").default(env.disableDomainVerfication).optional(),
}).readonly();

export async function DestinationCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await DestinationCreateBody(request,env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        //Add as destination mail address to cloudflare
        const addr = await cloudflareClient.emailRouting.addresses.create({
            account_id: env["CLOUDFLARE_ACCOUNT_ID"],
            email: createBody.data.mailBox + "@" + createBody.data.mailDomain
        });
        if(!addr) throw new Error("Created destination on cloudflare but did return nothing?");

        const inserted = await db
            .insertInto("destination")
            .values({
                ...createBody.data,
                userID: createBody.data.user.id,
                cloudflareDestinationID: addr.id as any,
                ...createBody.data.categoryID !== undefined ? { categoryID: createBody.data.categoryID?.id||null } : {},
                //@ts-expect-error
                user: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow()



        console.log("[DestinationCreate]", `Created new Destination(${inserted.id})`);
        return Response.json({ error: false, destination: TransformDestination(inserted) });
    }
}