import { Kysely, sql } from 'kysely'
import { RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("authKey")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())
    .addColumn("type", "text", col => col.notNull())

    //Relations
    .addColumn("userID", "uuid", col => col.references("user.id").onDelete("cascade"))

    //Display
    .addColumn("displayColor", "text", col => col.defaultTo(null))
    .addColumn("displayIcon", "text", col => col.defaultTo(null))
    .addColumn("displayName", "text", col => col.defaultTo(null))
    .addColumn("displayURL", "text", col => col.defaultTo(null))
    .addColumn("displayImage", "text", col => col.defaultTo(null))

    //Token
    .addColumn("tokenHash", "text", col => col.notNull())
    .addColumn("tokenSalt", "text", col => col.notNull())

    //Creator Tracking
    .addColumn("creatorIP", "text", col => col.notNull())
    .addColumn("creatorUserAgent", "text", col => col.notNull())

    //State
    .addColumn("invalidatedReason", "text", col => col.defaultTo(null))

    //Timestamps
    .addColumn("expiresAt", "datetime", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("lastUsedAt", "datetime", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
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
    .dropTable("authKey")
    .compile()
  );
  return sqls
}