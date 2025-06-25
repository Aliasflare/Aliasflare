import { db } from "../../Database";
import { InvalidMethodError, InvalidOperationError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AuthKeyLogout(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/authKey/logout")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.authKey) return InvalidOperationError("Not allowed to logout if not logged in");
        if(request.authKey.type != "LOGIN") return InvalidOperationError("Not allowed to logout with an authKey that does not originate from login");

        //Invalidate key
        const updated = await db
            .updateTable("authKey")
            .where("id", "==", request.authKey.id)
            .set({
                invalidatedReason: "LOGOUT",
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //Delete authKey values from session
        delete request.authKey;
        delete request.authKeyUser;

        //Generate response
        console.log("[AuthKeyLogout]", `Invalided AuthKey(${updated.id}) for user '${updated.userID}'`);
        return Response.json({ error: false });
    }
}