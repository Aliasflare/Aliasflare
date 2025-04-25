import { db } from "../../Database";
import { InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function UserSelf(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/self")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        console.log("[UserGet]", `Get User(${request.user.id})`);
		return Response.json({ error: false, user: { ...request.user, passwordHash: undefined, passwordSalt: undefined } });
    }
}