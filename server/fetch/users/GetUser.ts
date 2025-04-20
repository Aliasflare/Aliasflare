import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, InvalidOperationError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateUUID } from "../../utils/Validators";
import { User } from "../../database";

export async function GetUser(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(body.self && !request.user) return InvalidOperationError("Cannot get self when not logged in");
        if(body.self) body.id = request.user?.id;

        if(!body.id) return BodyFieldMissingError("id");
        if(typeof body.id != 'string') return BodyFieldInvalidTypeError("id", "string");
        if(!validateUUID(body.id)) return BodyFieldMalformedError("id", "Not an UUID");
        if(!request.isAdmin && request.user?.id != body.id) return NotAllowedError("Only Admin can get other users");

        //Check if users exists
        const user:Partial<User>|undefined = await db
            .selectFrom("user")
            .selectAll()
            .where("id", "==", body.id)
            .limit(1)
            .executeTakeFirst();
        if(!user) return TargetNotFoundError("user");
        delete user["passwordHash"];
        delete user["passwordSalt"];
		return Response.json({ error: false, user });
	}
}