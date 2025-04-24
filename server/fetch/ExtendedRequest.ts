import { DBTableFullObject } from "../Database";

export interface ExtendedRequest extends Request {
    session: DBTableFullObject<"session">;
    user?: DBTableFullObject<"user">;
    isAdmin: boolean;
}