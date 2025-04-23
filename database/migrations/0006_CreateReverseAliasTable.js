import { Kysely, sql } from 'kysely'
import { RANDOM_20_TOKEN, RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("reverseAlias")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())

    //Relations
    .addColumn("aliasID", "text", col => col.notNull().references("alias.id").onDelete("cascade"))

    //Alias
    .addColumn("token", "text", col => col.notNull().defaultTo(RANDOM_20_TOKEN))
    .addUniqueConstraint("reverse_alias_untaken_on_alias", ["token", "aliasID"])

    //Destination
    .addColumn("destinationName", "text", col => col.defaultTo(null))
    .addColumn("destinationMail", "text", col => col.notNull())

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
    .dropTable("reverseAlias")
    .compile()
  );
  return sqls
}