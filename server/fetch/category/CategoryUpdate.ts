import { z } from "zod";
import { db } from "../../Database";
import { ExtendedRequest } from "../ExtendedRequest";
import { InvalidBodyError, InvalidMethodError, NotAllowedError } from "../Errors";
import { ZodBoolean } from "../../validators/BasicValidators";
import { ZodRequestBody } from "../../validators/RequestValidators";
import { ZodAccessibleObjectFromTable } from "../../validators/DatabaseValidators";
import { ZodDisplayColor, ZodDisplayIcon, ZodDisplayImage, ZodDisplayName, ZodDisplayURL } from "../../validators/DisplayValidators";
import { TransformCategory } from "./CategoryTransformer";

const CategoryUpdateBody = (request: ExtendedRequest, env: any) => z.object({
    category: ZodAccessibleObjectFromTable("category", "id")(request.user?.id, request.isAdmin),
    displayColor: ZodDisplayColor.optional(),
    displayIcon: ZodDisplayIcon.optional(),
    displayName: ZodDisplayName.optional(),
    displayURL: ZodDisplayURL,
    displayImage: ZodDisplayImage,
    enabled: ZodBoolean.optional(),
}).readonly();

export async function CategoryUpdate(request: ExtendedRequest, env: any) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/category/update")) {
        if(!db) throw new Error("Database error");
        if(request.method != "POST") return InvalidMethodError("POST")
        if(!request.user) return NotAllowedError("Need to be logged in");

        const body = await ZodRequestBody.safeParseAsync(request);
        if(body.error) return InvalidBodyError(body.error.issues);

        const updateBody = await CategoryUpdateBody(request,env).safeParseAsync(body.data);
        if(updateBody.error) return InvalidBodyError(updateBody.error.issues);
        if(Object.keys(updateBody.data).length < 2) return InvalidBodyError("At least one field has to be updated!");

        const updated = await db
            .updateTable("category")
            .where("id", "==", updateBody.data.category.id)
            .set({
                ...updateBody.data,
                //@ts-expect-error
                category: undefined
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        //TODO: Send confirmation mail if not verfieid and mail changed

        console.log("[CategoryUpdate]", `Updated Category(${updated.id})`);
        return Response.json({ error: false, category: TransformCategory(updated) });
    }
}