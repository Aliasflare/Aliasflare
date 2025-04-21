import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("reverseAlias")
    .addColumn("id", "text", col => col.notNull().primaryKey())
    .addColumn("alias", "text", col => col.notNull().references("alias.id").onDelete("cascade"))
    .addColumn("friendlyName", "text", col => col.defaultTo(null))
    .addColumn("destinationName", "text", col => col.defaultTo(null))
    .addColumn("destinationMail", "text", col => col.notNull())
    .addColumn("lastMailAt", "datetime", col => col.defaultTo(null))
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
    .dropTable("alias")
    .compile()
  );
  return sqls
}