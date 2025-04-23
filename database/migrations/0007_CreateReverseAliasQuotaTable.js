import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("reverseAliasQuota")
    //ID & Relations
    .addColumn("reverseAliasID", "text", col => col.notNull().references("reverseAlias.id").onDelete("cascade"))
    .addColumn("date", "date", col => col.notNull().defaultTo(sql`CURRENT_DATE`))
    .addPrimaryKeyConstraint("aliasquota_pkey", ["reverseAliasID", "date"])

    //Data
    .addColumn("incomingMailCount", "integer", col => col.notNull().defaultTo(0))
    .addColumn("outgoingMailCount", "integer", col => col.notNull().defaultTo(0))
    .addColumn("rejectedMailCount", "integer", col => col.notNull().defaultTo(0))

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
    .dropTable("reverseAliasQuota")
    .compile()
  );
  return sqls
}