import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { hashPassword, verifyPassword } from "../../utils/Passwords";
import { z } from "zod";
import { ZodObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodPassword } from "../../validators/CredentialValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { generateAuthKeyToken } from "../../utils/IDs";

export const ZodValidCredentials = z.object({
    username: ZodObjectFromTable("user", "username"),
    password: ZodPassword,
})
.refine(async(a) => {
    if(!a.password || !a.username) return false;
    if(!await verifyPassword(a.password, a.username.passwordHash, a.username.passwordSalt)) return false;
    return true;
}, "Must be a valid username and password combination")
.transform(a => ({ user: a.username }));

export async function AuthKeyLogin(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/authKey/login")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const credentials = await ZodValidCredentials.safeParseAsync(body.data);
        if(credentials.error) return InvalidBodyError(credentials.error.issues);

        //Create auth key
        const token = generateAuthKeyToken();
        const hashedToken = await hashPassword(token);
        const inserted = await db
            .insertInto("authKey")
            .values({
                id: generateAuthKeyToken(),
                type: "LOGIN",
                userID: credentials.data.user.id,
                creatorUserAgent: request.headers.get("User-Agent")||"Unknown",
                creatorIP: request.headers.get("cf-connecting-ip")||"Unknown",
                tokenHash: hashedToken.hash,
                tokenSalt: hashedToken.salt,
                expiresAt: new Date(Date.now() + 1000*60*60*24*7).toISOString() //7 Days
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //Generate response
        console.log("[AuthKeyLogin]", `Created AuthKey(${inserted.id}) as user '${credentials.data.user.id}'`);
        return Response.json({ error: false, authKey: inserted.id + "-" + token });
    }
}