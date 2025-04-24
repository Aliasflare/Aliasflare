import { db } from "../../Database";
import { InvalidMethodError, InvalidOperationError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AuthLogout(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/auth/logout")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return InvalidOperationError("Not allowed to logout if not logged in");

        //Update session
        await db
            .updateTable("session")
            .where("id", "==", request.session.id)
            .set({userID: null })
            .execute();

        //Generate response
        console.log("[AuthLogout]", `Logged out'`);
        return Response.json({ error: false });
    }
}