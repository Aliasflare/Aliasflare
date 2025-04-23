import { z } from "zod";
import { db } from "../Database";
import { sql } from "kysely";

export const ZodUsername = z
  .string()
  .nonempty()
  .min(4)
  .max(32)
  .regex(/^[a-zA-Z0-9_]+$/, { message: "Must only contain alpha-numeric or underscore charcacters" });

export const ZodUntakenUsername = ZodUsername
  .refine(async(a) => {
    if(!db) throw new Error("Database error");
    return (await db.
      selectFrom("user")
      .select("id")
      .where(sql`LOWER(username)`, "==", a.toLowerCase())
      .limit(1)
      .executeTakeFirst()) == null;
  }, "Must be a not-taken username");

export const ZodPassword = z
  .string()
  .nonempty()
  .min(12)
  .max(64);

export const ZodBoolean = z
  .boolean();

export const ZodString = z
  .string();

export const ZodUUID = z
  .string()
  .uuid();

export const ZodMailName = z
  .string()
  .nonempty()
  .min(4)
  .max(64)
  .refine(a => a.match(/[\x00-\x1F\x7F]/) == null, { message: "Must not contain control characters" })
  .refine(a => a.match(/\\$/) == null, { message: "Must not contain dangling bachslash" })
  .refine(a => (a.match(/(?<!\\)"/)?.length||0) % 2 === 0, { message: "Must not contain uneven unescaped quotes" });

export const ZodMailAddress = z
  .string()
  .email();

export const ZodUntakenMailAddress = ZodMailAddress
  .refine(async(a) => {
    if(!db) throw new Error("Database error");
    return (await db.
      selectFrom("user")
      .select("id")
      .where(sql`LOWER(mail)`, "==", a.toLowerCase())
      .limit(1)
      .executeTakeFirst()) == null;
  }, "Must be a not-taken mail address");

export const ZodValidDomain = (env: any) => z
  .string()
  .min(1)
  .refine(a => env.domains.toLowerCase().split(",").includes(a.toLowerCase()), { message: "Must be a valid domain" });

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