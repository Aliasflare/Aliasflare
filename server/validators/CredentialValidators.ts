import { hashPassword } from "../utils/Passwords";
import { ZodString } from "./BasicValidators";
import { ExistsInTableFilter } from "./DatabaseValidators";
import { ZodMailAddress } from "./MailValidators";

export const ZodUsername = ZodString
  .nonempty()
  .min(4)
  .max(32)
  .regex(/^[a-zA-Z0-9_]+$/, { message: "Must only contain alpha-numeric or underscore charcacters" });

export const ZodPassword = ZodString
  .nonempty()
  .min(12)
  .max(64);

export const ZodHashedPassword = ZodPassword
  .transform(async(a) => await hashPassword(a));

export const ZodUserUntakenUsername = ZodUsername
  .refine(async(a) => !(await ExistsInTableFilter("user", "username")(a)), "Must be a non-taken username address");

export const ZodUserUntakenMail = ZodMailAddress
  .refine(async(a) => !(await ExistsInTableFilter("user", "mail")(a)), "Must be a non-taken mail address");