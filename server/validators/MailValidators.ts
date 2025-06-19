import { ZodOneOfWithoutCasing, ZodString } from "./BasicValidators";

export const ZodMailName = ZodString
  .nonempty()
  .min(4)
  .max(64)
  .refine(a => a.match(/[\x00-\x1F\x7F]/) == null, { message: "Must not contain control characters" })
  .refine(a => a.match(/\\$/) == null, { message: "Must not contain dangling bachslash" })
  .refine(a => (a.match(/(?<!\\)"/)?.length||0) % 2 === 0, { message: "Must not contain uneven unescaped quotes" });

export const ZodMailAddress = ZodString
  .email();

export const ZodMailBox = ZodString
  .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/, "Must be a valid mailbox part");

export const ZodDomain = ZodString
  .regex(/^(?=.{1,253}$)(?!\-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,}$/, "Must be a valid mail domain");

export const ZodMailValidDomain = (env: any) => ZodOneOfWithoutCasing(env.CLOUDFLARE_DOMAINS.split(","));