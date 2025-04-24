import { z } from "zod";
import { db } from "../../Database";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodBoolean, ZodNumber } from "../../validators/BasicValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodHashedPassword, ZodUserUntakenMail, ZodUserUntakenUsername } from "../../validators/CredentialValidators";

const UpdateUserBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    updates: z.object({
        username: ZodUserUntakenUsername.optional(),
        password: ZodHashedPassword.optional(),
        mail: ZodUserUntakenMail.optional(),
        admin: ZodBoolean.refine(a => request.isAdmin, "Must be admin to set role").optional(),
        maxIncomingPerDay: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
        maxOutgoingPerDay: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
        maxAliasCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
        maxDestinationCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
        maxCategoryCount: ZodNumber.positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    })
});

export async function UpdateUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodRequestBody.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const updateBody = await UpdateUserBody(request, env).safeParseAsync(rawBody.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);

        //Update fields
        const updateResult = await db
            .updateTable("user")
            .where("id", "==", updateBody.data.user.id)
            .set({
                ...updateBody.data.updates,
                passwordHash: updateBody.data.updates.password?.hash,
                passwordSalt: updateBody.data.updates.password?.salt,
            })
            .executeTakeFirst();
        if(updateResult.numUpdatedRows == BigInt(0)) return TargetNotFoundError("user");

        console.log("[CreateUser]", `Updated user with id '${updateBody.data.user.id}'`);
        return Response.json({ error: false, userID: updateBody.data.user.id });
    }
}