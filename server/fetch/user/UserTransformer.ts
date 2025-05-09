import { Selectable } from "kysely";
import { User } from "../../../database/.generated/db";

export function TransformUser(user: Selectable<User>) {
    return {
        ...user,
        admin: Boolean(user.admin),
        passwordHash: undefined,
        passwordSalt: undefined
    };
}