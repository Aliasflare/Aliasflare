import { z } from "zod";
import { db } from "../../Database";
import { ZodBoolean, ZodJSONObject, ZodListPagination, ZodUUID } from "../../utils/Validators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

const ZodListAliasBody = (request: ExtendedRequest, env: Env) => z.object({
    userId: ZodUUID.optional(),
    own: ZodBoolean.optional()
})
.extend(ZodListPagination.shape)
.refine(a => a.own||a.userId, "Must specify either userId or own")
.refine(a => a.own == undefined || request.user, "Must be signed in to operate on own")
.transform(a => ({ ...a, userId: a.userId||request.user?.id as string }))
.refine(a => a.userId == request.user?.id ||request.isAdmin, "Must be admin to list other users aliases");

export async function AliasList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);
            
        const listAliasBody = await ZodListAliasBody(request, env).safeParseAsync(rawBody.data);
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