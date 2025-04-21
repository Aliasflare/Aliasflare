import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface ReverseAliasQuotaTable {
    reverseAlias: ColumnType<string, string, never>;
    alias: ColumnType<string, string, never>;
    date: ColumnType<string, string|Date, never>;
    incomingMailCount: ColumnType<number, number|null, number|null>;
    outgoingMailCount: ColumnType<number, number|null, number|null>;
}

export type ReverseAliasQuota = Selectable<ReverseAliasQuotaTable>;
export type NewReverseAliasQuota = Insertable<ReverseAliasQuotaTable>;
export type ReverseAliasQuotaUpdate = Updateable<ReverseAliasQuotaTable>;