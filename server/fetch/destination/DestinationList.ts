import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodListPaginationLimit, ZodListPaginationPage, ZodRequestBody } from "../../validators/RequestValidators";

const DestinationListBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    page: ZodListPaginationPage,
    limit: ZodListPaginationLimit
});

export async function DestinationList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/destination/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const listBody = await DestinationListBody(request, env).safeParseAsync(body.data);
        if(listBody.error) return InvalidBodyError(listBody.error.issues);

        const list = await db
            .selectFrom("destination")
            .selectAll()
            .where("userID", "==", listBody.data.user.id)
            .limit(listBody.data.limit)
            .offset(listBody.data.page)
            .execute();

        console.log("[DestinationList]", `Listed ${list.length} Destinations`);
        return Response.json({ error: false, destinations: list.map(a => ({ ...a })) });
    }
}