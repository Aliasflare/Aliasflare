import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
    id: ColumnType<string, string, never>;
    username: ColumnType<string, string, string>;
    passwordHash: ColumnType<string, string, string>;
    passwordSalt: ColumnType<string, string, string>;
    mail: ColumnType<string, string, string>;
    createdAt: ColumnType<string, never, never>;
    admin: ColumnType<number, boolean|null, boolean|null>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;