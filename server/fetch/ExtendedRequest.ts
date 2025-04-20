import { Session, User } from "../database";

export interface ExtendedRequest extends Request {
    session: Session;
    user?: User;
    isAdmin: boolean;
}