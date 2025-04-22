import { z } from "zod";
import { db } from "../../database/D1DB";
import { ZodAliasID, ZodJSONObject } from "../../utils/Validators";
import { InvalidBodyError, InvalidMethodError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

const ZodAliasGetBody = z.object({
    id: ZodAliasID
}).readonly();

export async function AliasGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const parsedBody = await ZodAliasGetBody.safeParseAsync(rawBody.data);
        if(parsedBody.error) return InvalidBodyError(parsedBody.error.issues);

        //Check if users exists
        const alias = await db
            .selectFrom("alias")
            .selectAll()
            .where("id", "==", parsedBody.data.id)
            .limit(1)
            .executeTakeFirst();
        if(!alias) return TargetNotFoundError("alias");
        if(alias.user != request.user?.id) return NotAllowedError("Must be admin to modify other users aliases");
        return Response.json({ error: false, alias });
    }
}