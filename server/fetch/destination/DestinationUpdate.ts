import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodMailBox, ZodMailName, ZodMailValidDomain } from "../../validators/MailValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayName } from "../../validators/DisplayValidators";

const DestinationUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    mailName: ZodMailName.optional(),
    mailBox: ZodMailBox.optional(),
    mailDomain: ZodMailValidDomain(env).optional(),
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

        const mailChanged = (updateBody.data.mailBox||updateBody.data.mailDomain);
        const updated = await db
            .updateTable("destination")
            .where("id", "==", updateBody.data.destination.id)
            .set({
                ...updateBody.data,
                ...mailChanged ? { verified: updateBody.data.verified||(Boolean(env.disableDomainVerfication) ? 1 : 0) } : {}
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //TODO: Send confirmation mail if not verfieid and mail changed

        console.log("[DestinationUpdate]", `Updated Destination(${updated.id})`);
        return Response.json({ error: false, destination: { ...updated, verifyToken: undefined } });
    }
}