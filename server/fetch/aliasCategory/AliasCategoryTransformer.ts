import { Selectable } from "kysely";
import { AliasCategory } from "../../../database/.generated/db";

export function TransformAliasCategory(aliasCategory: Selectable<AliasCategory>) {
    return {
        ...aliasCategory,
        enabled: Boolean(aliasCategory.enabled)
    };
}