import { ZodString } from "./BasicValidators";

import IconData from '../../database/SelectIconsData.json';
const iconNames = IconData.icons.map(a => a.properties.name);

export const ZodDisplayName = ZodString.optional();
export const ZodDisplayColor = ZodString.optional();
export const ZodDisplayIcon = ZodString.refine(a => iconNames.includes(a), "Must be a valid primeicon name").optional();