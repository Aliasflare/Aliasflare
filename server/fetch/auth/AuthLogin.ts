import { sql } from "kysely";
import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, InvalidOperationError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateUsername } from "../../utils/Validators";
import { verifyPassword } from "../../utils/Passwords";

export async function AuthLogin(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/auth/login")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(!body.username) return BodyFieldMissingError("username");
        if(typeof body.username != 'string') return BodyFieldInvalidTypeError("username", "string");
        if(body.username.length < 4) return BodyFieldMalformedError("username", "Has to be at least 4 characters");
        if(!validateUsername(body.username)) return BodyFieldMalformedError("username", "Not an valid username");

        if(!body.password) return BodyFieldMissingError("password");
        if(typeof body.password != 'string') return BodyFieldInvalidTypeError("password", "string");
        if(body.password.length < 12) return BodyFieldMalformedError("password", "Has to be at least 12 characters");

        if(request.user) return InvalidOperationError("Not allowed to login if already logged in");

        const user = await db
            .selectFrom("user")
            .selectAll()
            .where(sql`LOWER(username)`, "==", body.username.toLowerCase())
            .limit(1)
            .executeTakeFirst();
        if(!user) return BodyFieldMalformedError("username,password", "Invalid username or password");
        if(!verifyPassword(body.password, user.passwordSalt, user.passwordHash))  return BodyFieldMalformedError("username,password", "Invalid username or password");

        await db
            .updateTable("session")
            .where("id", "==", request.session.id)
            .set({
                user: user.id,
            })
            .execute();
        request.session.user = user.id;
        request.user = user;

        console.log("[AuthLogin]", `Logged in as '${user.id}'`);
        return Response.json({ error: false, userID: user.id });
    }
}