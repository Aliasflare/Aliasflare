import { db } from "../../Database";
import { ZodListPagination } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AliasList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);
            
        const listPagination = await ZodListPagination.safeParseAsync(body.data);
        if(listPagination.error) return InvalidBodyError(listPagination.error.issues);

        /*const userTarget = await ZodUserTarget(request, env).safeParseAsync(rawBody.data);
        if(userTarget.error) return InvalidBodyError(userTarget.error.issues);

        //Check if users exists
        const aliases = await db
            .selectFrom("alias")
            .selectAll()
            .where("userID", "==", userTarget.data.userId)
            .limit(listPagination.data.limit)
            .offset(listPagination.data.page)
            .execute();

        return Response.json({ error: false, aliases });*/
        //TODO: FIX!!!
        return Response.json({ error: true, type: "NOT_IMPLEMENTED" })
    }
}