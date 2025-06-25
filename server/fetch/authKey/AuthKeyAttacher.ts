import { db } from "../../Database";
import { verifyPassword } from "../../utils/Passwords";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AuthKeyAttacher(request: ExtendedRequest, env: Env) {
    if(!db) throw new Error("Database error");
    console.log("[AuthKeyAttacher]", `Attaching...`);

    //Parse authorization header
    const authorizationHeader = request.headers.get("Authorization");
    if(!authorizationHeader) return console.log("[AuthKeyAttacher]", `No Authorization header found! Skipped!`);;
    const authorizationHeaderValues = authorizationHeader.split(" ");
    const authorizationHeaderType = authorizationHeaderValues[0];
    if(authorizationHeaderType != "Basic") return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Malformed header", details: "Invalid auth-scheme" }), { status: 400 });
    if(!authorizationHeader) return console.log("[AuthKeyAttacher]", `Authorization found!`);;

    //Parse AuthKey
    const credentials = authorizationHeaderValues.slice(1);
    const authKey = credentials.at(0);
    if(!authKey) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Malformed header", details: "Empty credentials" }), { status: 400 });
    if(!authKey.includes("-")) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Authentication key malformed", details: "Missing dash" }), { status: 400 });
    const authKeyID = authKey.split("-")[0];
    const authKeyToken = authKey.split("-")[1];
    if(!authorizationHeader) return console.log("[AuthKeyAttacher]", `Authorization is AuthKey!`);;

    //Validate AuthKey
    const authKeyFromDB = await db
        .selectFrom("authKey")
        .selectAll()
        .where("id", "==", authKeyID)
        .limit(1)
        .executeTakeFirst();
    if(!authKeyFromDB) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Authentication key not found", details: "Invalid authKey (id)" }), { status: 400 });
    if(!await verifyPassword(authKeyToken, authKeyFromDB.tokenHash, authKeyFromDB.tokenSalt)) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Authentication key malformed", details: "Invalid authKey (token)" }), { status: 400 });
    if(new Date(authKeyFromDB.expiresAt) < new Date()) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Authentication key expired", details: "authKey expired" }), { status: 400 });
    if(authKeyFromDB.invalidatedReason) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "Authentication key invalidated", details: authKeyFromDB.invalidatedReason }), { status: 400 });
    if(!authorizationHeader) return console.log("[AuthKeyAttacher]", `Authorization is valid AuthKey!`);;

    //Also fetch user
    const authKeyUserFromDB = await db
        .selectFrom("user")
        .selectAll()
        .where("id", "==", authKeyFromDB.userID)
        .limit(1)
        .executeTakeFirst();
    if(!authKeyUserFromDB) return new Response(JSON.stringify({ error: true, type: "AUTHORIZATION_ERROR", message: "User account deleted" }), { status: 400 });
    if(!authorizationHeader) return console.log("[AuthKeyAttacher]", `Authorization AuthKey has User!`);;

    request.authKey = authKeyFromDB;
    request.authKeyUser = authKeyUserFromDB;
}