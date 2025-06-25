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
import { sendRawMailViaCloudflare } from "../../utils/MailSend";
import { BuildDestinationRemovedMail } from "../../utils/TemplateMails";

const DestinationUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request),
    categoryID: z.union([ZodAccessibleObjectFromTable("category", "id")(request), ZodEmptyString]).optional(),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    displayURL: ZodDisplayURL,
    displayImage: ZodDisplayImage,
    mailName: z.union([ZodMailName, ZodEmptyString]).optional(),
    mailBox: ZodMailBox.optional(),
    mailDomain: ZodDomain.optional(),
    enabled: ZodBoolean.optional(),
}).readonly();

export async function DestinationUpdate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.authKey) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await DestinationUpdateBody(request,env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);
        if(Object.keys(updateBody.data).length < 2) return InvalidBodyError("At least one field has to be updated!");

        const mailChanged = (updateBody.data.mailBox||updateBody.data.mailDomain);

        let newAddr;
        if(mailChanged) {
            //Delete old destination from cloudflare if the mail has been changed
            await sendRawMailViaCloudflare(BuildDestinationRemovedMail(updateBody.data.destination, env.CLOUDFLARE_DOMAINS.split(",")[0]), env);
            await cloudflareClient.emailRouting.addresses.delete(
                updateBody.data.destination.cloudflareDestinationID,
                { account_id: env["CLOUDFLARE_ACCOUNT_ID"] },
            );

            //Add as destination to cloudflare if the mail has been changed
            newAddr = await cloudflareClient.emailRouting.addresses.create({
                account_id: env["CLOUDFLARE_ACCOUNT_ID"],
                email: (updateBody.data.mailBox||updateBody.data.destination.mailBox) + "@" + (updateBody.data.mailDomain||updateBody.data.destination.mailDomain)
            });
        }

        const updated = await db
            .updateTable("destination")
            .where("id", "==", updateBody.data.destination.id)
            .set({
                ...updateBody.data,
                ...mailChanged ? { verified: false } : {},
                ...newAddr ? { cloudflareDestinationID: newAddr.id } : {},
                ...updateBody.data.categoryID !== undefined ? { categoryID: updateBody.data.categoryID?.id||null } : {},
                //@ts-expect-error
                destination: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        console.log("[DestinationUpdate]", `Updated Destination(${updated.id})`);
        return Response.json({ error: false, destination: TransformDestination(updated) });
    }
}