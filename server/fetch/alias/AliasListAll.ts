import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodListPaginationLimit, ZodListPaginationPage, ZodRequestBody } from "../../validators/RequestValidators";
import { TransformAlias } from "./AliasTransformer";

const AliasListAllBody = (request: ExtendedRequest, env: Env) => z.object({
    page: ZodListPaginationPage,
    limit: ZodListPaginationLimit
});

export async function AliasListAll(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/alias/listAll")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.authKeyUser?.admin) return NotAllowedError("Need to be Admin");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const listBody = await AliasListAllBody(request, env).safeParseAsync(body.data);
        if(listBody.error) return InvalidBodyError(listBody.error.issues);

        const list = await db
            .selectFrom("alias")
            .selectAll()
            .limit(listBody.data.limit)
            .offset(listBody.data.page)
            .execute();

        console.log("[AliasListAll]", `Listed ${list.length} Aliases`);
        return Response.json({ error: false, aliases: list.map(a => TransformAlias(a)) });
    }
}