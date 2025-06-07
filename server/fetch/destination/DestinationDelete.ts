import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { cloudflareClient } from "../../CloudflareClient";

const DestinationDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin)
});

export async function DestinationDelete(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const deleteBody = await DestinationDeleteBody(request, env).safeParseAsync(body.data);
        if(deleteBody.error) return InvalidBodyError(deleteBody.error.issues);

        await db
            .deleteFrom("destination")
            .where("id", "==", deleteBody.data.destination.id)
            .executeTakeFirst();

        //Remove destination mail adress from cloudflare
        await cloudflareClient.emailRouting.addresses.delete(
            deleteBody.data.destination.mailBox + "@" + deleteBody.data.destination.mailDomain,
            { account_id: env["CLOUDFLARE_ACCOUNT_ID"] },
        );

        console.log("[DestinationDelete]", `Deleted Destination(${deleteBody.data.destination.id})`);    
        return Response.json({ error: false });
    }
}