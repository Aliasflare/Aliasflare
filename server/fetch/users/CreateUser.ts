import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodBoolean, ZodNumber } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodUserUntakenUsername, ZodUserUntakenMail, ZodHashedPassword } from "../../validators/CredentialValidators";

const CreateUserBody = (request: ExtendedRequest, env: Env) => z.object({
    username: ZodUserUntakenUsername,
    password: ZodHashedPassword,
    mail: ZodUserUntakenMail,
    admin: ZodBoolean.refine(a => request.isAdmin, "Must be admin to set role").optional(),
    maxIncomingPerDay: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxOutgoingPerDay: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxAliasCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxDestinationCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxCategoryCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
});

export async function CreateUser(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.isAdmin) return NotAllowedError("Need to be Admin");

        //Parse and validate body
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await CreateUserBody(request, env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        //Create new user
        const newUser = await db
            .insertInto("user")
            .values({
                ...createBody.data,
                passwordHash: createBody.data.password.hash,
                passwordSalt: createBody.data.password.salt,
            })
            .returningAll()
            .execute();
        console.log("[CreateUser]", `Created new user with id '${newUser}'`);
		return Response.json({ error: false, userID: newUser });
	}
}