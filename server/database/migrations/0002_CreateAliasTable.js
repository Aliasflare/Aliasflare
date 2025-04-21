import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("alias")
    .addColumn("id", "text", col => col.notNull())
    .addColumn("domain", "text", col => col.notNull())
    .addPrimaryKeyConstraint("alias_pkey", ["id", "domain"])
    .addColumn("user", "uuid", col => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("friendlyName", "text", col => col.defaultTo(null))
    .addColumn("destinationMail", "text", col => col.notNull())
    .addColumn("destinationName", "text", col => col.defaultTo(null))
    .addColumn("remoteNameOverwriteOnIncoming", "text", col => col.defaultTo(null)) //Use this instead of original senders name on incoming mails
    .addColumn("remoteNameOverwriteOnOutgoing", "text", col => col.defaultTo(null)) //Use this instead of original senders name on outgoing mails
    .addColumn("ownNameOverwriteOnOutgoing", "text", col => col.defaultTo(null)) //Use this instead of our name in a response-mail
    .addColumn("enabled", "boolean", col => col.notNull().defaultTo(true))
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