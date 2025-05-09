import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AttachUser(request: ExtendedRequest, env: Env) {
    if(!db) throw new Error("Database error");
    if(request.session.userID) {
        const user = await db.selectFrom("user").selectAll().where("id", "==", request.session.userID).executeTakeFirst();
        if(!user) throw new Error("Session user not found but present?! (THIS SEEMS TO BE A DATABASE CORRUPTION!!!)");
        request.user = user;
        console.info("[AttachUser]", `Attached User(${user.id})`);
    } else console.info("[AttachUser]", `Session has no user`);
}