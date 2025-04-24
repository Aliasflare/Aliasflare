import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, InvalidOperationError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { verifyPassword } from "../../utils/Passwords";
import { z } from "zod";
import { ZodObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodPassword } from "../../validators/CredentialValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

export const ZodValidCredentials = z.object({
    username: ZodObjectFromTable("user", "username"),
    password: ZodPassword,
})
.refine(async(a) => {
    if(!verifyPassword(a.password, a.username.passwordSalt, a.username.passwordHash)) return false;
    return true;
}, "Must be a valid username and password combination")
.transform(a => ({ user: a.username }));

export async function AuthLogin(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/auth/login")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(request.user) return InvalidOperationError("Not allowed to login if already logged in");

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const credentials = await ZodValidCredentials.safeParseAsync(body.data);
        if(credentials.error) return InvalidBodyError(credentials.error.issues);

        //Update session
        await db
            .updateTable("session")
            .where("id", "==", request.session.id)
            .set({ userID: credentials.data.user.id })
            .execute();

        //Attach user to session object
        request.session.userID = credentials.data.user.id;
        request.user = request.user;

        //Generate response
        console.log("[AuthLogin]", `Logged in as '${credentials.data.user.id}'`);
        return Response.json({ error: false, userID: credentials.data.user.id });
    }
}