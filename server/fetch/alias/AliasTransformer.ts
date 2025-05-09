import { Selectable } from "kysely";
import { Alias } from "../../../database/.generated/db";

export function TransformAlias(alias: Selectable<Alias>) {
    return {
        ...alias,
        enabled: new Boolean(alias.enabled)
    }
}