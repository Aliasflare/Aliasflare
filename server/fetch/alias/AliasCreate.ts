import { z } from "zod";
import { db } from "../../database/D1DB";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodJSONObject, ZodMailAddress, ZodMailName, ZodString, ZodValidDomain } from "../../utils/Validators";

const ZodAliasCreateBody = (env: any) => z.object({
    destinationMail: ZodMailAddress,
    destinationName: ZodMailName.optional(),
    domain: ZodValidDomain(env),
    friendlyName: ZodString.optional()
}).readonly();

export async function AliasCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        //Parse and validate body
        const rawBody = await request.text().then(a => ZodJSONObject.safeParseAsync(a));
        if(rawBody.error) return InvalidBodyError(rawBody.error.issues);

        const parsedBody = await ZodAliasCreateBody(env).safeParseAsync(rawBody);
        if(parsedBody.error) return InvalidBodyError(parsedBody.error.issues);

        //Generate new not-taken id for the alias
        let newAliasID = crypto.randomUUID().slice(0, 24).replaceAll("-", "");
        while(await db.selectFrom("reservedAddress").selectAll().where("mailbox", "==", newAliasID).executeTakeFirst()) {
            console.log("[AliasCreate]", `Skipping already used address '${newAliasID}`);
            newAliasID = crypto.randomUUID().slice(0, 24).replaceAll("-", "");
        }

        //Insert alias
        await db
            .insertInto("alias")
            .values({
                id: newAliasID,
                user: request.user.id,
                domain: parsedBody.data.domain.toLowerCase(),
                friendlyName: parsedBody.data.friendlyName,
                destinationMail: parsedBody.data.destinationMail,
                destinationName: parsedBody.data.destinationName,
            })
            .execute();
        console.log("[AliasCreate]", `Created new alias for '${parsedBody.data.destinationMail}' with id '${newAliasID}'`);
        return Response.json({ error: false, aliasID: newAliasID });
    }
}