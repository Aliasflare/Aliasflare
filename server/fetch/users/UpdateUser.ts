import { db } from "../../database/D1DB";
import { InvalidBodyError, InvalidMethodError, TargetNotFoundError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodJSONObject, ZodPassword, ZodUntakenMailAddress, ZodUntakenUsername } from "../../utils/Validators";
import { hashPassword } from "../../utils/Passwords";
import { ZodGetUserBody } from "./GetUser";
import { z } from "zod";

export const ZodUpdateUserBody = (request: ExtendedRequest, env: Env) => z
.object({
    username: ZodUntakenUsername.optional(),
    password: ZodPassword.optional(),
    mail: ZodUntakenMailAddress.optional(),
    maxIncomingPerDay: z.number().positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    maxOutgoingPerDay: z.number().positive().refine(a => request.isAdmin, "Must be admin to set quota").optional(),
    admin: z.boolean().refine(a => request.isAdmin, "Must be admin to set role").optional()
});

const RefinedZodUpdateUserBody = (request: ExtendedRequest, env: Env) => ZodUpdateUserBody(request, env)
.refine(a => Object.keys(a).length > 0, "Must contain at least one update field");

export async function UpdateUser(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const userBody = await ZodGetUserBody(request, env).safeParseAsync(rawBody.data);
        if(userBody.error) return InvalidBodyError(userBody.error.issues);

        const updateBody = await RefinedZodUpdateUserBody(request, env).safeParseAsync(rawBody.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);

        //Update fields
        const hashedPassword = updateBody.data.password ? await hashPassword(updateBody.data.password) : null;
        const updateResult = await db
            .updateTable("user")
            .where("id", "==", userBody.data.id)
            .set({
                ...updateBody.data.username ? { username: updateBody.data.username } : {},
                ...updateBody.data.password ? { passwordHash: hashedPassword?.hash, passwordSalt: hashedPassword?.salt } : {},
                ...updateBody.data.mail ? { mail: updateBody.data.mail } : {},
                ...updateBody.data.maxIncomingPerDay ? { maxIncomingPerDay: updateBody.data.maxIncomingPerDay } : {},
                ...updateBody.data.maxOutgoingPerDay ? { maxOutgoingPerDay: updateBody.data.maxOutgoingPerDay } : {},
                ...updateBody.data.admin ? { admin: updateBody.data.admin } : {},
            })
            .executeTakeFirst();
        if(updateResult.numUpdatedRows == BigInt(0)) return TargetNotFoundError("user");

        console.log("[CreateUser]", `Updated user with id '${userBody.data.id}'`);
        return Response.json({ error: false, userID: userBody.data.id });
    }
}