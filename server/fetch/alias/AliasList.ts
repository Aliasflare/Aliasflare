import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, InvalidOperationError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AliasList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(body.self && !request.user) return InvalidOperationError("Cannot get self when not logged in");
        if(body.self) body.userId = request.user?.id;
        if(!request.isAdmin && request.user?.id != body.userId) return NotAllowedError("Only Admin can list other users aliases");

        if(body.limit === undefined) return BodyFieldMissingError("limit");
        if(typeof body.limit != 'number') return BodyFieldInvalidTypeError("limit", "number");
        if(body.limit > 50) return BodyFieldMalformedError("limit", "Cannot be bigger than 50");

        if(!body.page === undefined) return BodyFieldMissingError("page");
        if(typeof body.page != 'number') return BodyFieldInvalidTypeError("page", "number");

        //Check if users exists
        const aliases = await db
            .selectFrom("alias")
            .selectAll()
            .where("user", "==", body.userId)
            .limit(body.limit)
            .offset(body.limit*body.page)
            .orderBy("alias.lastMailAt", "desc")
            .execute();

        return Response.json({ error: false, aliases });
    }
}