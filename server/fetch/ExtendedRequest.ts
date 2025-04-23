import { Session, User } from "../../OLD";

export interface ExtendedRequest extends Request {
    session: Session;
    user?: User;
    isAdmin: boolean;
}