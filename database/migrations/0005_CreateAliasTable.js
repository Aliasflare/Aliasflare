import { Kysely, sql } from 'kysely'
import { RANDOM_20_TOKEN, RANDOM_UUID } from '../Helpers.js';

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("alias")
    //ID
    .addColumn("id", "uuid", col => col.notNull().defaultTo(RANDOM_UUID).primaryKey())

    //Relations
    .addColumn("userID", "uuid", col => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("categoryID", "uuid", col => col.references("category.id").onDelete("set null"))
    .addColumn("destinationID", "uuid", col => col.references("destination.id").onDelete("set null"))

    //Alias
    .addColumn("token", "text", col => col.notNull().defaultTo(RANDOM_20_TOKEN))
    .addColumn("domain", "text", col => col.notNull())
    .addUniqueConstraint("alias_untaken_on_domain", ["token", "domain"])

    //Display
    .addColumn("displayColor", "text", col => col.defaultTo(null))
    .addColumn("displayIcon", "text", col => col.defaultTo(null))
    .addColumn("displayName", "text", col => col.defaultTo(null))

    //Options
    .addColumn("remoteNameOverwriteOnIncoming", "text", col => col.defaultTo(null)) //Use this instead of original senders name on incoming mails
    .addColumn("remoteNameOverwriteOnOutgoing", "text", col => col.defaultTo(null)) //Use this instead of original senders name on outgoing mails
    .addColumn("ownNameOverwriteOnOutgoing", "text", col => col.defaultTo(null)) //Use this instead of our name in a response-mail

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
    .dropTable("alias")
    .compile()
  );
  return sqls
}