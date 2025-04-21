import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateEmail, validateMailName } from "../../utils/Validators";

export async function AliasCreate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/create")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");
        //TODO: CHECK QUOTA

        let body:any;
        try { body = await request.json(); } catch (err) { return BodyMalformedError("Not a JSON body"); }

        if(body.destinationMail == undefined) return BodyFieldMissingError("destinationMail");
        if(typeof body.destinationMail != 'string') return BodyFieldInvalidTypeError("destinationMail", "string");
        if(!validateEmail(body.destinationMail)) return BodyFieldMalformedError("destinationMail", "Not an valid mail-address");

        if(body.domain == undefined) return BodyFieldMissingError("domain");
        if(typeof body.domain != 'string') return BodyFieldInvalidTypeError("domain", "string");
        if(!env.domains.toLowerCase().split(",").includes(body.domain.toLowerCase())) return BodyFieldMalformedError("domain", "Not an available domain");

        if(body.destinationName != undefined) {
            if(typeof body.destinationName != 'string') return BodyFieldInvalidTypeError("destinationName", "string");
            if(!validateMailName(body.destinationName)) return BodyFieldMalformedError("destinationMail", "Not an valid mail-name");
        }

        if(body.friendlyName != undefined) {
            if(typeof body.friendlyName != 'string') return BodyFieldInvalidTypeError("friendlyName", "string");
        }

        let newAliasID = crypto.randomUUID().slice(0, 24).replaceAll("-", "");
        while(await db.selectFrom("reservedAddress").selectAll().where("mailbox", "==", newAliasID).executeTakeFirst()) {
            console.log("[AliasCreate]", `Skipping already used address '${newAliasID}`);
            newAliasID = crypto.randomUUID().slice(0, 24).replaceAll("-", "");
        }

        await db
            .insertInto("alias")
            .values({
                id: newAliasID,
                domain: body.domain.toLowerCase(),
                user: request.user.id,
                friendlyName: body.friendlyName,
                destinationMail: body.destinationMail,
                destinationName: body.destinationName,
            })
            .execute();
        console.log("[AliasCreate]", `Created new alias for '${body.destinationMail}' with id '${newAliasID}'`);
        return Response.json({ error: false, aliasID: newAliasID });
    }
}