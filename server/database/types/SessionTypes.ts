import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface SessionTable {
    id: ColumnType<string, string, never>;
    ip: ColumnType<string, string, never>;
    userAgent: ColumnType<string, string, never>;
    createdAt: ColumnType<string, never, never>;
    expiresAt: ColumnType<string, string, never>;
    invalidateBecause: ColumnType<string, never, string>;
    user: ColumnType<string | null>;
}

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;