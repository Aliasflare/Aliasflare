import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface AliasTable {
    id: ColumnType<string, string, never>;
    domain: ColumnType<string, string, never>;
    user: ColumnType<string, string, never>;
    friendlyName: ColumnType<string|null>
    destinationMail: ColumnType<string>
    destinationName: ColumnType<string|null>
    enabled: ColumnType<boolean, boolean|null, boolean>
    lastMailAt: ColumnType<string|null, never, string|null>
    createdAt: ColumnType<string, never, never>
}

export type Alias = Selectable<AliasTable>;
export type NewAlias = Insertable<AliasTable>;
export type AliasUpdate = Updateable<AliasTable>;