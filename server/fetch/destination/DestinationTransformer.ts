import { Selectable } from "kysely";
import { Destination } from "../../../database/.generated/db";

export function TransformDestination(destination: Selectable<Destination>) {
    return {
        ...destination,
        cloudflareDestinationID: undefined,
        enabled: Boolean(destination.enabled),
        verified: Boolean(destination.verified)
    }
}