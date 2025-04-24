import { parse } from "cookie";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AttachSession(request: ExtendedRequest, env: Env) {
    if(!db) throw new Error("Database error");

    const sessionCookieName = "__sid";
    const cookies = parse(request.headers.get("Cookie") || "");

    let dropReason = null;
    if(cookies[sessionCookieName]) {
        //Session Cookies present
        const session = await db
            .selectFrom("session")
            .selectAll()
            .where("id", "==", cookies[sessionCookieName])
            .limit(1)
            .executeTakeFirst();
        if(!session) {
            //Session Cookie invalid
            console.info("[AttachSession]", "Session not found!");
            dropReason = "NOT_FOUND";
            delete cookies[sessionCookieName];
        } else {
            //Session Cookie valid (exists)
            if(new Date(session.createdAt + session.expiresAfter) < new Date()) {
                //Session Cookie expired
                console.info("[AttachSession]", "Session expired!");
                dropReason = "NOT_FOUND";
                delete cookies[sessionCookieName];
            } else if(session.invalidatedBecause) {
                console.info("[AttachSession]", `Invalidated session!`);
                dropReason = session.invalidatedBecause;
                delete cookies[sessionCookieName];
            } else {
                console.info("[AttachSession]", `Attached session '${session.id}'`);
                request.session = session;
            }
        }
    }

    if(!cookies[sessionCookieName]) {
        console.info("[AttachSession]", "Attaching new cookie!");
        const randID = crypto.randomUUID();
        await db
            .insertInto("session")
            .values({
                id: randID,
                userAgent: request.headers.get("User-Agent")||"Unknown",
                ip: request.headers.get("cf-connecting-ip")||"Unknown",
                expiresAfter: 1000 * 60 * 60 * 24 * 7
            })
            .execute();
            console.info("[AttachSession]", "New session created:", randID);
        return new Response(null, {
            status: 302,
            headers: {
                'Set-Cookie': `${sessionCookieName}=${randID}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(Date.now() * 1000 * 60 * 60 * 24).toUTCString()}`,
                'Location': request.url,
                ... dropReason ? {'X-Session-Drop-Reason': dropReason } : {},
            }
        });
    }
}