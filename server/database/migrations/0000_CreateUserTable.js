import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("user")
    .addColumn("id", "uuid", col => col.notNull().primaryKey())
    .addColumn("domain", "text", col => col.notNull())
    .addColumn("username", "text", col => col.notNull().unique())
    .addColumn("passwordHash", "text", col => col.notNull())
    .addColumn("passwordSalt", "text", col => col.notNull())
    .addColumn("maxOutgoingPerDay", "integer", col => col.defaultTo(null))
    .addColumn("maxIncomingPerDay", "integer", col => col.defaultTo(null))
    .addColumn("mail", "text", col => col.notNull())
    .addColumn("createdAt", "text", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("admin", "boolean", col => col.notNull().defaultTo(false))
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
    .dropTable("user")
    .compile()
  );
  return sqls
}