import { sql } from "kysely";
import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateEmail, validateUsername } from "../../utils/Validators";
import { hashPassword } from "../../utils/Passwords";

export async function CreateUser(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.isAdmin) return NotAllowedError("Need to be Admin");

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(!body.username) return BodyFieldMissingError("username");
        if(typeof body.username != 'string') return BodyFieldInvalidTypeError("username", "string");
        if(body.username.length < 4) return BodyFieldMalformedError("username", "Has to be at least 4 characters");
        if(!validateUsername(body.username)) return BodyFieldMalformedError("username", "Not an valid username");

        if(!body.password) return BodyFieldMissingError("password");
        if(typeof body.password != 'string') return BodyFieldInvalidTypeError("password", "string");
        if(body.password.length < 12) return BodyFieldMalformedError("password", "Has to be at least 12 characters");

        if(!body.mail) return BodyFieldMissingError("mail");
        if(typeof body.mail != 'string') return BodyFieldInvalidTypeError("mail", "string");
        if(!validateEmail(body.mail)) return BodyFieldMalformedError("mail", "Not an valid mail-address");

        //Check if username is already taken
        const conflictingUserName = await db
            .selectFrom("user")
            .select([sql`COUNT(*)`.as('count')])
            .where(sql`LOWER(username)`, "==", body.username.toLowerCase())
            .limit(1)
            .executeTakeFirstOrThrow();
        if(conflictingUserName.count != 0) return BodyFieldMalformedError("username", "Username is already taken");

        //Check if mail is already bound to other account
        const conflictingMail = await db
            .selectFrom("user")
            .select([sql`COUNT(*)`.as('count')])
            .where(sql`LOWER(mail)`, "==", body.mail.toLowerCase())
            .limit(1)
            .executeTakeFirstOrThrow();
        if(conflictingMail.count != 0) return BodyFieldMalformedError("mail", "Mail is already in use");

        //Create new user
        const newUserID = crypto.randomUUID();
        const hashedPassword = await hashPassword(body.password);
        await db
            .insertInto("user")
            .values({
                id: newUserID,
                username: body.username,
                passwordHash: hashedPassword.hash,
                passwordSalt: hashedPassword.salt,
                mail: body.mail
            })
            .execute();
        console.log("[CreateUser]", `Created new user with id '${newUserID}'`);
		return Response.json({ error: false, userID: newUserID });
	}
}