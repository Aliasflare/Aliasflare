import { ZodString } from "./BasicValidators";

export const ZodMailName = ZodString
  .nonempty()
  .min(4)
  .max(64)
  .refine(a => a.match(/[\x00-\x1F\x7F]/) == null, { message: "Must not contain control characters" })
  .refine(a => a.match(/\\$/) == null, { message: "Must not contain dangling bachslash" })
  .refine(a => (a.match(/(?<!\\)"/)?.length||0) % 2 === 0, { message: "Must not contain uneven unescaped quotes" });

export const ZodMailAddress = ZodString
  .email();

export const ZodValidDomain = (env: any) => ZodString
  .min(1)
  .refine(a => env.domains.toLowerCase().split(",").includes(a.toLowerCase()), { message: "Must be a valid domain" });