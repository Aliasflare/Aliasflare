import { db } from "../../database/D1DB";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AttachUser(request: ExtendedRequest, env: Env) {
    if(!db) throw new Error("Database error");

    if(request.session.user) {
        const user = await db.selectFrom("user").selectAll().where("id", "==", request.session.user).executeTakeFirst();
        if(!user) throw new Error("Session user not found but present?!");
        request.user = user;
        console.info("[AttachUser]", `Attached user '${user.id}'`);
    } else console.info("[AttachUser]", `Session has no user`);
}