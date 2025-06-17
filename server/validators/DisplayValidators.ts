import { ZodEmptyString, ZodString } from "./BasicValidators";

import IconData from '../../database/SelectIconsData.json';
import { z } from "zod";
const iconNames = IconData.icons.map(a => a.properties.name);

export const ZodDisplayName = ZodString.optional();
export const ZodDisplayColor = ZodString.optional();
export const ZodDisplayIcon = z.union([ZodEmptyString, ZodString.refine(a => iconNames.includes(a), "Must be a valid primeicon name")]).optional();
export const ZodDisplayURL = z.union([ZodEmptyString, ZodString.url()]).optional();
export const ZodDisplayImage = z.union([ZodEmptyString, ZodString.url()]).optional();