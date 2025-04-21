import { db } from "../../database/D1DB";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodJSONObject, ZodPassword, ZodUntakenMailAddress, ZodUntakenUsername } from "../../utils/Validators";
import { hashPassword } from "../../utils/Passwords";
import { ZodUpdateUserBody } from "./UpdateUser";

export const ZodCreateUserBody = (request: ExtendedRequest, env: Env) => ZodUpdateUserBody(request, env)
.extend({
    username: ZodUntakenUsername,
    password: ZodPassword,
    mail: ZodUntakenMailAddress,
});

export async function CreateUser(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.isAdmin) return NotAllowedError("Need to be Admin");

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const createBody = await ZodCreateUserBody(request, env).extend({}).safeParseAsync(rawBody);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        //Create new user
        const newUserID = crypto.randomUUID();
        const hashedPassword = await hashPassword(createBody.data.password);
        await db
            .insertInto("user")
            .values({
                id: newUserID,
                username: createBody.data.username,
                passwordHash: hashedPassword.hash,
                passwordSalt: hashedPassword.salt,
                mail: createBody.data.mail
            })
            .execute();
        console.log("[CreateUser]", `Created new user with id '${newUserID}'`);
		return Response.json({ error: false, userID: newUserID });
	}
}