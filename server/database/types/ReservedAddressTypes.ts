import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface ReservedAddressTable {
    mailbox: ColumnType<string, string, never>;
    domain: ColumnType<string, string, never>;
}

export type ReservedAddress = Selectable<ReservedAddressTable>;
export type NewReservedAddress = Insertable<ReservedAddressTable>;
export type ReservedAddressUpdate = Updateable<ReservedAddressTable>;