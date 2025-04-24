import { ZodString } from "./BasicValidators";

export const ZodDisplayName = ZodString.optional();
export const ZodDisplayColor = ZodString.optional();
export const ZodDisplayIcon = ZodString.optional();