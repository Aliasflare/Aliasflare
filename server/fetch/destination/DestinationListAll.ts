import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodListPaginationLimit, ZodListPaginationPage, ZodRequestBody } from "../../validators/RequestValidators";
import { TransformDestination } from "./DestinationTransformer";

const DestinationListAllBody = (request: ExtendedRequest, env: Env) => z.object({
    page: ZodListPaginationPage,
    limit: ZodListPaginationLimit
});

export async function DestinationListAll(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/listAll")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.authKeyUser?.admin) return InvalidMethodError("Need to be Admin");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const listBody = await DestinationListAllBody(request, env).safeParseAsync(body.data);
        if(listBody.error) return InvalidBodyError(listBody.error.issues);

        const list = await db
            .selectFrom("destination")
            .selectAll()
            .limit(listBody.data.limit)
            .offset(listBody.data.page)
            .execute();

        console.log("[DestinationListAll]", `Listed ${list.length} Destinations`);
        return Response.json({ error: false, destinations: list.map(a => TransformDestination(a)) });
    }
}