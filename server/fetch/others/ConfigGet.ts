import { z } from "zod";
import { db } from "../../Database";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ExtendedRequest } from "../ExtendedRequest";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";

const ConfigGetBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
});

export async function ConfigGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/config")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST");
        
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await ConfigGetBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);
        
        console.log("[ConfigGetBody]", `Get Config`);
        return Response.json({ error: false, config: { 
            domains: env.domains.split(",")
        } });
    }
}