import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function ListUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.isAdmin) return NotAllowedError("Need to be Admin");

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(body.limit === undefined) return BodyFieldMissingError("limit");
        if(typeof body.limit != 'number') return BodyFieldInvalidTypeError("limit", "number");
        if(body.limit > 50) return BodyFieldMalformedError("limit", "Cannot be bigger than 50");

        if(!body.page === undefined) return BodyFieldMissingError("page");
        if(typeof body.page != 'number') return BodyFieldInvalidTypeError("page", "number");

        //Check if users exists
        const users = await db
            .selectFrom("user")
            .select(["id", "username", "mail", "createdAt"])
            .limit(body.limit)
            .offset(body.limit*body.page)
            .execute();
            
        return Response.json({ error: false, users });
    }
}