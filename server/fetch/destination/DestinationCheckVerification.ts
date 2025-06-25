import { z } from "zod";
import { db } from "../../Database";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { TransformDestination } from "./DestinationTransformer";
import { cloudflareClient } from "../../CloudflareClient";

const DestinationCheckVerificationBody = (request: ExtendedRequest, env: Env) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request)
});

export async function DestinationCheckVerification(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/checkVerification")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const checkVerficationBody = await DestinationCheckVerificationBody(request, env).safeParseAsync(body.data);
        if(checkVerficationBody.error) return InvalidBodyError(checkVerficationBody.error.issues);
        
        if(!checkVerficationBody.data.destination.verified) {
            const address = await cloudflareClient.emailRouting.addresses.get(checkVerficationBody.data.destination.cloudflareDestinationID, {
                account_id: env["CLOUDFLARE_ACCOUNT_ID"]
            });
            if(address.verified)
                checkVerficationBody.data.destination = await db.updateTable("destination").where("id", "==", checkVerficationBody.data.destination.id).set({ verified: 1 }).returningAll().executeTakeFirstOrThrow();
        }
        
        console.log("[DestinationCheckVerification]", `Check Destination(${checkVerficationBody.data.destination.id})`);
        return Response.json({ error: false, destination: TransformDestination(checkVerficationBody.data.destination) });
    }
}