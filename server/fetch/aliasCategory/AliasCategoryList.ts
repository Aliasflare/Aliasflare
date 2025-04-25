import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodListPaginationLimit, ZodListPaginationPage, ZodRequestBody } from "../../validators/RequestValidators";

const AliasCategoryListBody = (request: ExtendedRequest, env: Env) => z.object({
    user: ZodAccessibleObjectFromTable("user", "id")(request.user?.id, request.isAdmin),
    page: ZodListPaginationPage,
    limit: ZodListPaginationLimit
});

export async function AliasCategoryList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/aliasCategory/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const listBody = await AliasCategoryListBody(request, env).safeParseAsync(body.data);
        if(listBody.error) return InvalidBodyError(listBody.error.issues);

        const list = await db
            .selectFrom("aliasCategory")
            .selectAll()
            .where("userID", "==", listBody.data.user.id)
            .limit(listBody.data.limit)
            .offset(listBody.data.page)
            .execute();

        console.log("[AliasCategoryList]", `Listed ${list.length} AliasCategories`);
        return Response.json({ error: false, aliasCategories: list.map(a => ({ ...a })) });
    }
}