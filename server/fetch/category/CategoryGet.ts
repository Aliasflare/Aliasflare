import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError } from "../Errors";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { TransformCategory } from "./CategoryTransformer";

const CategoryGetBody = (request: ExtendedRequest, env: Env) => z.object({
    category: ZodAccessibleObjectFromTable("category", "id")(request.user?.id, request.isAdmin)
});

export async function CategoryGet(request: ExtendedRequest, env: Env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/category/get")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        
        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const getBody = await CategoryGetBody(request, env).safeParseAsync(body.data);
        if(getBody.error) return InvalidBodyError(getBody.error.issues);
        
        console.log("[CategoryGet]", `Get Category(${getBody.data.category.id})`);
        return Response.json({ error: false, category: TransformCategory(getBody.data.category) });
    }
}