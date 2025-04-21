import { SessionTable, UserTable, AliasTable, ReverseAliasTable, ReservedAddressTable } from './types/index';
import { Kysely, Transaction } from "kysely";

export interface Database {
  session: SessionTable,
  user: UserTable,
  alias: AliasTable,
  reverseAlias: ReverseAliasTable,
  reservedAddress: ReservedAddressTable
}

export type DatabaseOrTransaction = Kysely<Database> | Transaction<Database>;