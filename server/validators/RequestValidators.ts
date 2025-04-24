import { z } from "zod";

export const ZodRequestBody = z.object({
    text: z.function().returns(z.string())
})
.transform(async(a) => await a.text())
.refine(a => { try { JSON.parse(a); return true; } catch(err) { return false; } }, "Must be a JSON formatted body")
.transform(a => JSON.parse(a) as Object);