import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("reservedAddress")
    //ID
    .addColumn("mailBox", "text", col => col.notNull())
    .addColumn("mailDomain", "text", col => col.notNull())
    .addPrimaryKeyConstraint("reservedaddress_pkey", ["mailBox", "mailDomain"])

    //Timestamps
    .addColumn("updatedAt", "datetime", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("createdAt", "datetime", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
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