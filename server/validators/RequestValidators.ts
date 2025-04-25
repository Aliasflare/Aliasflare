import { z } from "zod";
import { ZodNumber } from "./BasicValidators";

export const ZodRequestBody = {
    safeParseAsync: async(a: any) => {
        const text = await a.text();
        return ZodJsonString.safeParse(text)
    }    
};

export const ZodJsonString =z
.string()
.refine(a => { try { JSON.parse(a); return true; } catch(err) { return false; } }, "Must be a JSON formatted body")
.transform(a => JSON.parse(a) as Object);

export const ZodListPaginationPage = ZodNumber
.nonnegative();

export const ZodListPaginationLimit = ZodNumber
.positive()
.max(50, "Must be less or equal than 50");