import { db } from "../../database/D1DB";
import { ZodJSONObject, ZodListPagination } from "../../utils/Validators";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function ListUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.isAdmin) return NotAllowedError("Need to be Admin");

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const listPagination = await ZodListPagination.safeParseAsync(rawBody.data);
        if(listPagination.error) return InvalidBodyError(listPagination.error.issues);

        //Check if users exists
        const users = await db
            .selectFrom("user")
            .select(["id", "username", "mail", "createdAt"])
            .limit(listPagination.data.limit)
            .offset(listPagination.data.page)
            .execute();
            
        return Response.json({ error: false, users });
    }
}