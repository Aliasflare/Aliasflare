import { Kysely, sql } from 'kysely'
import { RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("destination")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())

    //Relations
    .addColumn("userID", "uuid", col => col.notNull().references("user.id").onDelete("cascade"))

    //Display
    .addColumn("displayColor", "text", col => col.defaultTo(null))
    .addColumn("displayIcon", "text", col => col.defaultTo(null))
    .addColumn("displayName", "text", col => col.defaultTo(null))

    //Destination
    .addColumn("mailName", "text", col => col.defaultTo(null))
    .addColumn("mailBox", "text", col => col.notNull())
    .addColumn("mailDomain", "text", col => col.notNull())
    .addUniqueConstraint("destination_only_once", ["mailBox", "mailDomain"])

    //State
    .addColumn("enabled", "boolean", col => col.notNull().defaultTo(true))

    //Verification
    .addColumn("verifyToken", "text", col => col.defaultTo(null))
    .addColumn("verified", "boolean", col => col.notNull().defaultTo(false))

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
    .dropTable("destination")
    .compile()
  );
  return sqls
}