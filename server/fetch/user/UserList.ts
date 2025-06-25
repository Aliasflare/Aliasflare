import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodListPaginationLimit, ZodListPaginationPage, ZodRequestBody } from "../../validators/RequestValidators";
import { TransformUser } from "./UserTransformer";

const UserListBody = (request: ExtendedRequest, env: Env) => z.object({
    page: ZodListPaginationPage,
    limit: ZodListPaginationLimit
});

export async function UserList(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/user/list")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.authKeyUser?.admin) return NotAllowedError("Need to be Admin");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const listBody = await UserListBody(request, env).safeParseAsync(body.data);
        if(listBody.error) return InvalidBodyError(listBody.error.issues);

        const list = await db
            .selectFrom("user")
            .selectAll()
            .limit(listBody.data.limit)
            .offset(listBody.data.page)
            .execute();
         
        console.log("[UserList]", `Listed ${list.length} Users`);
        return Response.json({ error: false, users: list.map(a => TransformUser(a)) });
    }
}