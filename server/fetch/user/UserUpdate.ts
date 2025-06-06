import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodBoolean, ZodNumber } from "../../validators/BasicValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodHashedPassword, ZodUserUntakenMail, ZodUserUntakenUsername } from "../../validators/CredentialValidators";
import { TransformUser } from "./UserTransformer";

const UserUpdateBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    username: ZodUserUntakenUsername.optional(),
    password: ZodHashedPassword.optional(),
    mail: ZodUserUntakenMail.optional(),
    admin: ZodBoolean.refine(a => request.isAdmin, "Must be admin to make admin").optional(),
    maxIncomingPerDay: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxOutgoingPerDay: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxAliasCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxDestinationCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxCategoryCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
});

export async function UserUpdate(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await UserUpdateBody(request, env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);
        if(Object.keys(updateBody.data).length < 2) return InvalidBodyError("At least one field has to be updated!");

        const updated = await db
            .updateTable("user")
            .where("id", "==", updateBody.data.user.id)
            .set({
                ...updateBody.data,
                passwordHash: updateBody.data.password?.hash,
                passwordSalt: updateBody.data.password?.salt,
                //@ts-expect-error
                user: undefined,
                password: undefined,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        console.log("[UserUpdate]", `Updated User(${updated.id})`);
        return Response.json({ error: false, user: TransformUser(updated) });
    }
}