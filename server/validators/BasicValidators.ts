import { z } from "zod";

export const ZodNumber = z
  .number();

export const ZodString = z
  .string();

export const ZodBoolean = z
  .boolean()
  .transform(a => a ? 1 : 0);

export const ZodUUID = z
  .string()
  .uuid();

export const ZodJSONObject = z
  .string()
  .refine(a => { try{ JSON.parse(a); return true; } catch(err) { return false; } }, { message: "Must be a JSON String"})
  .transform(a => JSON.parse(a));

export const ZodListPagination = z
  .object({
    page: z.number().nonnegative().default(0),
    limit: z.number().positive().max(50).default(10)
  });

export const ZodAliasID = z
  .string()
  .nonempty()
  .length(20)
  .regex(/^[a-zA-Z0-9]+$/, { message: "Must only contain alpha-numeric charcacters" });