import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("reservedAddress")
    .addColumn("mailbox", "text", col => col.notNull())
    .addColumn("domain", "text", col => col.notNull())
    .addPrimaryKeyConstraint("reservedaddress_pkey", ["mailbox", "domain"])
    .compile()
  );
  return sqls
}

/**
 * @param {Kysely} db 
 */
export async function down(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .dropTable("reservedAddress")
    .compile()
  );
  return sqls
}