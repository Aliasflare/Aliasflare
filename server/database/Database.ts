import { SessionTable, UserTable, AliasTable, ReverseAliasTable } from './types/index';
import { Kysely, Transaction } from "kysely";

export interface Database {
  session: SessionTable,
  user: UserTable,
  alias: AliasTable,
  reverseAlias: ReverseAliasTable
}

export type DatabaseOrTransaction = Kysely<Database> | Transaction<Database>;