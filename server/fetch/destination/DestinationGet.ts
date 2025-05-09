import { z } from "zod";
import { db } from "../../Database";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { TransformDestination } from "./DestinationTransformer";

const DestinationGetBody = (request: ExtendedRequest, env: Env) => z.object({
    destination: ZodAccessibleObjectFromTable("destination", "id")(request.user?.id, request.isAdmin)
});

export async function DestinationGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await DestinationGetBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);
        
        console.log("[DestinationGet]", `Get Destination(${getBody.data.destination.id})`);
        return Response.json({ error: false, destination: TransformDestination(getBody.data.destination) });
    }
}