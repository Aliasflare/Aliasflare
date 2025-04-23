import { Kysely, sql } from 'kysely'
import { RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("user")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())

    //Data
    .addColumn("username", "text", col => col.notNull().unique())
    .addColumn("mail", "text", col => col.notNull().unique())
    .addColumn("passwordHash", "text", col => col.notNull())
    .addColumn("passwordSalt", "text", col => col.notNull())

    //Roles
    .addColumn("admin", "boolean", col => col.notNull().defaultTo(false))

    //Quota
    .addColumn("maxOutgoingPerDay", "integer", col => col.defaultTo(null))
    .addColumn("maxIncomingPerDay", "integer", col => col.defaultTo(null))
    .addColumn("maxAliasCount", "integer", col => col.defaultTo(null))
    .addColumn("maxDestinationCount", "integer", col => col.defaultTo(null))
    .addColumn("maxCategoryCount", "integer", col => col.defaultTo(null))

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
    .dropTable("user")
    .compile()
  );
  return sqls
}