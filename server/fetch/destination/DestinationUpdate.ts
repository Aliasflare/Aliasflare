import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodDomain, ZodMailBox, ZodMailName } from "../../validators/MailValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";
import { TransformDestination } from "./DestinationTransformer";

const DestinationUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    mailName: ZodMailName.optional(),
    mailBox: ZodMailBox.optional(),
    mailDomain: ZodDomain.optional(),
    enabled: ZodBoolean.optional(),
    verified: ZodBoolean.refine(a => request.isAdmin, "Must be admin to set verfied").optional(),
}).readonly();

export async function DestinationUpdate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await DestinationUpdateBody(request,env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);
        if(Object.keys(updateBody.data).length < 2) return InvalidBodyError("At least one field has to be updated!");

        const mailChanged = (updateBody.data.mailBox||updateBody.data.mailDomain);
        const updated = await db
            .updateTable("destination")
            .where("id", "==", updateBody.data.destination.id)
            .set({
                ...updateBody.data,
                ...mailChanged ? { verified: updateBody.data.verified||env.disableDomainVerfication } : {},
                //@ts-expect-error
                destination: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //TODO: Send confirmation mail if not verfieid and mail changed

        console.log("[DestinationUpdate]", `Updated Destination(${updated.id})`);
        return Response.json({ error: false, destination: TransformDestination(updated) });
    }
}