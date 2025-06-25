import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";

const CategoryDeleteBody = (request: ExtendedRequest, env: Env) => z.object({
    category: ZodAccessibleObjectFromTable("category", "id")(request)
});

export async function CategoryDelete(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/category/delete")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const deleteBody = await CategoryDeleteBody(request, env).safeParseAsync(body.data);
        if(deleteBody.error) return InvalidBodyError(deleteBody.error.issues);

        await db
            .deleteFrom("category")
            .where("id", "==", deleteBody.data.category.id)
            .executeTakeFirst();

        console.log("[CategoryDelete]", `Deleted Category(${deleteBody.data.category.id})`);    
        return Response.json({ error: false });
    }
}