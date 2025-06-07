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
import { cloudflareClient } from "../../CloudflareClient";

const DestinationUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    mailName: ZodMailName.optional(),
    mailBox: ZodMailBox.optional(),
    mailDomain: ZodDomain.optional(),
    enabled: ZodBoolean.optional(),
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

        //Delete old destination from cloudflare if the mail has been changed
        if(mailChanged) {
            await cloudflareClient.emailRouting.addresses.delete(
                updateBody.data.destination.mailBox + "@" + updateBody.data.destination.mailDomain,
                { account_id: env["CLOUDFLARE_ACCOUNT_ID"] },
            );
        }

        const updated = await db
            .updateTable("destination")
            .where("id", "==", updateBody.data.destination.id)
            .set({
                ...updateBody.data,
                ...mailChanged ? { verified: false } : {},
                //@ts-expect-error
                destination: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //Add as destination to cloudflare if the mail has been changed
        if(mailChanged) {
            await cloudflareClient.emailRouting.addresses.create({
                account_id: env["CLOUDFLARE_ACCOUNT_ID"],
                email: updateBody.data.mailBox + "@" + updateBody.data.mailDomain
            });
        }

        console.log("[DestinationUpdate]", `Updated Destination(${updated.id})`);
        return Response.json({ error: false, destination: TransformDestination(updated) });
    }
}