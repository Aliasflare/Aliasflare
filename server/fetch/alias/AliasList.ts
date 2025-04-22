import { z } from "zod";
import { db } from "../../database/D1DB";
import { ZodJSONObject, ZodListPagination, ZodUUID } from "../../utils/Validators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

const ZodListAliasBody = z.object({
    userId: ZodUUID
}).
extend(ZodListPagination.shape);

export async function AliasList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);
            
        const listAliasBody = await ZodListAliasBody.safeParseAsync(rawBody.data);
        if(listAliasBody.error) return InvalidBodyError(listAliasBody.error.issues);
    
        //Check if users exists
        const aliases = await db
            .selectFrom("alias")
            .selectAll()
            .where("user", "==", listAliasBody.data.userId)
            .limit(listAliasBody.data.limit)
            .offset(listAliasBody.data.page)
            .orderBy("alias.lastMailAt", "desc")
            .execute();

        return Response.json({ error: false, aliases });
    }
}