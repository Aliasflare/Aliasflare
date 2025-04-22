import { sql } from "kysely";
import { db } from "../../database/D1DB";
import { BodyFieldMalformedError, InvalidBodyError, InvalidMethodError, InvalidOperationError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodJSONObject, ZodPassword, ZodUsername } from "../../utils/Validators";
import { verifyPassword } from "../../utils/Passwords";
import { z } from "zod";

export const ZodValidCredentials = z.object({
    username: ZodUsername,
    password: ZodPassword,
})
.refine(async(a) => {
    if(!db) throw new Error("Database error");
    const user = await db
            .selectFrom("user")
            .select(["passwordSalt", "passwordHash"])
            .where(sql`LOWER(username)`, "==", a.username.toLowerCase())
            .limit(1)
            .executeTakeFirst();
    if(!user) return false;
    if(!verifyPassword(a.password, user.passwordSalt, user.passwordHash)) return false;
    return true;
}, "Must be a valid username and password combination");

export async function AuthLogin(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/auth/login")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(request.user) return InvalidOperationError("Not allowed to login if already logged in");

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const credentials = await ZodValidCredentials.safeParseAsync(rawBody.data);
        if(credentials.error) return InvalidBodyError(credentials.error.issues);

        //Find user
        const user = await db
            .selectFrom("user")
            .selectAll()
            .where(sql`LOWER(username)`, "==", credentials.data.username)
            .limit(1)
            .executeTakeFirstOrThrow();

        //Update session
        await db
            .updateTable("session")
            .where("id", "==", request.session.id)
            .set({
                user: user.id,
            })
            .execute();

        //Attach user to session object
        request.session.user = user.id;
        request.user = user;

        console.log("[AuthLogin]", `Logged in as '${user.id}'`);
        return Response.json({ error: false, userID: user.id });
    }
}