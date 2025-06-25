import { DBTableFullObject } from "../Database";

export interface ExtendedRequest extends Request {
    authKey?: DBTableFullObject<"authKey">;
    authKeyUser?: DBTableFullObject<"user">;
}