import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, InvalidOperationError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateUUID } from "../../utils/Validators";

export async function AliasGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(!body.id) return BodyFieldMissingError("id");
        if(typeof body.id != 'string') return BodyFieldInvalidTypeError("id", "string");
        if(!validateUUID(body.id)) return BodyFieldMalformedError("id", "Not an UUID");

        //Check if users exists
        const alias = await db
            .selectFrom("alias")
            .selectAll()
            .where("id", "==", body.id)
            .limit(1)
            .executeTakeFirst();
        if(!alias) return TargetNotFoundError("alias");
        if(alias.user != request.user?.id) return NotAllowedError("Only Admin can get other users aliases");
        return Response.json({ error: false, alias });
    }
}