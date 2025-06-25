import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodBoolean, ZodNumber } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodUserUntakenUsername, ZodUserUntakenMail, ZodHashedPassword } from "../../validators/CredentialValidators";
import { TransformUser } from "./UserTransformer";

const UserCreateBody = (request: ExtendedRequest, env: Env) => z.object({
    username: ZodUserUntakenUsername,
    password: ZodHashedPassword,
    mail: ZodUserUntakenMail,
    admin: ZodBoolean.refine(a => request.authKeyUser?.admin, "Must be admin to make admin").optional(),
    maxIncomingPerDay: ZodNumber.positive().refine(a => request.authKeyUser?.admin, "Must be admin to set quota").optional(),
    maxOutgoingPerDay: ZodNumber.positive().refine(a => request.authKeyUser?.admin, "Must be admin to set quota").optional(),
    maxAliasCount: ZodNumber.positive().refine(a => request.authKeyUser?.admin, "Must be admin to set quota").optional(),
    maxDestinationCount: ZodNumber.positive().refine(a => request.authKeyUser?.admin, "Must be admin to set quota").optional(),
    maxCategoryCount: ZodNumber.positive().refine(a => request.authKeyUser?.admin, "Must be admin to set quota").optional(),
});

export async function UserCreate(request: ExtendedRequest, env: Env) {
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api/user/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.authKeyUser?.admin) return NotAllowedError("Need to be Admin");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const createBody = await UserCreateBody(request, env).safeParseAsync(body.data);
        if(createBody.error) return InvalidBodyError(createBody.error.issues);

        const inserted = await db
            .insertInto("user")
            .values({
                ...createBody.data,
                passwordHash: createBody.data.password.hash,
                passwordSalt: createBody.data.password.salt,
                //@ts-expect-error
                password: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow()

        console.log("[UserCreate]", `Created new User(${inserted.id })`);
		return Response.json({ error: false, user: TransformUser(inserted) });
	}
}