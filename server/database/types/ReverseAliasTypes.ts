import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface ReverseAliasTable {
    id: ColumnType<string, string, never>;
    alias: ColumnType<string, string, never>;
    friendlyName: ColumnType<string|null>
    destinationMail: ColumnType<string>
    destinationName: ColumnType<string|null>
    lastMailAt: ColumnType<string|null, never, string|null>
    createdAt: ColumnType<string, never, never>
}

export type ReverseAlias = Selectable<ReverseAliasTable>;
export type NewReverseAlias = Insertable<ReverseAliasTable>;
export type ReverseAliasUpdate = Updateable<ReverseAliasTable>;