import { Selectable } from "kysely";
import { Category } from "../../../database/.generated/db";

export function TransformCategory(category: Selectable<Category>) {
    return {
        ...category,
        enabled: Boolean(category.enabled)
    };
}