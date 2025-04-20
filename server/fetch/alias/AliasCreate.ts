import { db } from "../../database/D1DB";
import { BodyFieldInvalidTypeError, BodyFieldMalformedError, BodyFieldMissingError, BodyMalformedError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { validateEmail, validateMailName } from "../../utils/Validators";

export async function AliasCreate(request: ExtendedRequest, env: Env) {
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

        if(body.destinationName != undefined) {
            if(typeof body.destinationName != 'string') return BodyFieldInvalidTypeError("destinationName", "string");
            if(!validateMailName(body.destinationName)) return BodyFieldMalformedError("destinationMail", "Not an valid mail-name");
        }

        if(body.friendlyName != undefined) {
            if(typeof body.friendlyName != 'string') return BodyFieldInvalidTypeError("friendlyName", "string");
        }

        const newAliasID = crypto.randomUUID();
        await db
            .insertInto("alias")
            .values({
                id: newAliasID,
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