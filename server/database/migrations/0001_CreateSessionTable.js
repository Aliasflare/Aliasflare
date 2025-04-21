import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("session")
    .addColumn("id", "uuid", col => col.notNull().primaryKey())
    .addColumn("ip", "text", col => col.notNull())
    .addColumn("userAgent", "text", col => col.notNull())
    .addColumn("createdAt", "datetime", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("expiresAt", "datetime", col => col.notNull())
    .addColumn("invalidateBecause", "text")
    .addColumn("user", "uuid", col => col.references("user.id"))
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
    .dropTable("session")
    .compile()
  );
  return sqls
}