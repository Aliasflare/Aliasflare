import { Kysely, sql } from 'kysely'
import { RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("session")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())

    //Relations
    .addColumn("userID", "uuid", col => col.references("user.id").onDelete("cascade"))

    //Tracking
    .addColumn("ip", "text", col => col.notNull())
    .addColumn("userAgent", "text", col => col.notNull())

    //Validation
    .addColumn("expiresAfter", "integer", col => col.notNull())
    .addColumn("invalidatedBecause", "text", col => col.defaultTo(null))

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
    .dropTable("session")
    .compile()
  );
  return sqls
}