import { Kysely, sql } from 'kysely'
import { RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("category")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())

    //Relations
    .addColumn("userID", "uuid", col => col.notNull().references("user.id").onDelete("cascade"))

    //Display
    .addColumn("displayColor", "text", col => col.defaultTo(null))
    .addColumn("displayIcon", "text", col => col.defaultTo(null))
    .addColumn("displayName", "text", col => col.defaultTo(null))

    //State
    .addColumn("enabled", "boolean", col => col.notNull().defaultTo(true))

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
    .dropTable("aliasCategory")
    .compile()
  );
  return sqls
}