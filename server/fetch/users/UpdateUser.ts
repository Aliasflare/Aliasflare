import { sql } from "kysely";
import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, InvalidOperationError, NotAllowedError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateEmail, validateUsername, validateUUID } from "../../utils/Validators";
import { hashPassword } from "../../utils/Passwords";

export async function UpdateUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
       
        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }
       
        if(body.self && !request.user) return InvalidOperationError("Cannot update self when not logged in");
        if(body.self) body.id = request.user?.id;
       
        if(!body.id) return BodyFieldMissingError("id");
        if(typeof body.id != 'string') return BodyFieldInvalidTypeError("id", "string");
        if(!validateUUID(body.id)) return BodyFieldMalformedError("id", "Not an UUID");
        if(!request.isAdmin && request.user?.id != body.id) return NotAllowedError("Only Admin can update other users");

        if(!request.isAdmin && body.maxIncomingPerDay != undefined) return NotAllowedError("Only Admin can update quotas");
        if(!request.isAdmin && body.maxOutgoingPerDay != undefined) return NotAllowedError("Only Admin can update quotas");
        if(!request.isAdmin && body.admin != undefined) return NotAllowedError("Only Admin can update admin status");

        if(body.username != undefined) {
            if(typeof body.username != 'string') return BodyFieldInvalidTypeError("username", "string");
            if(body.username.length < 4) return BodyFieldMalformedError("username", "Has to be at least 4 characters");
            if(!validateUsername(body.username)) return BodyFieldMalformedError("username", "Not an valid username");
        
            //Check if username is already taken
            const conflictingUserName = await db
                .selectFrom("user")
                .select([sql`COUNT(*)`.as('count')])
                .where(sql`LOWER(username)`, "==", body.username.toLowerCase())
                .limit(1)
                .executeTakeFirstOrThrow();
            if(conflictingUserName.count != 0) return BodyFieldMalformedError("username", "Username is already taken");
        }

        if(body.mail != undefined) {
            if(typeof body.mail != 'string') return BodyFieldInvalidTypeError("mail", "string");
            if(!validateEmail(body.mail)) return BodyFieldMalformedError("mail", "Not an valid mail-address");

            //Check if mail is already bound to other account
            const conflictingMail = await db
                .selectFrom("user")
                .select([sql`COUNT(*)`.as('count')])
                .where(sql`LOWER(mail)`, "==", body.mail.toLowerCase())
                .limit(1)
                .executeTakeFirstOrThrow();
            if(conflictingMail.count != 0) return BodyFieldMalformedError("mail", "Mail is already in use");
        }

        //Update fields
        const hashedPassword = body.password ? await hashPassword(body.password) : null;
        const updateResult = await db
            .updateTable("user")
            .where("id", "==", body.id)
            .set({
                ...body.username ? { username: body.username } : {},
                ...body.password ? { passwordHash: hashedPassword?.hash, passwordSalt: hashedPassword?.salt } : {},
                ...body.mail ? { mail: body.mail } : {},
                ...body.maxIncomingPerDay ? { maxIncomingPerDay: body.maxIncomingPerDay } : {},
                ...body.maxOutgoingPerDay ? { maxOutgoingPerDay: body.maxOutgoingPerDay } : {},
                ...body.admin ? { admin: body.admin } : {},
            })
            .executeTakeFirst();
        if(updateResult.numUpdatedRows == BigInt(0)) return TargetNotFoundError("user");

        console.log("[CreateUser]", `Updated user with id '${body.id}'`);
        return Response.json({ error: false, userID: body.id });
    }
}