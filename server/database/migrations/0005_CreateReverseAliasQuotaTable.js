import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  const sqls = [];
  sqls.push(
  db.schema
    .createTable("reverseAliasQuota")
    .addColumn("reverseAlias", "text", col => col.notNull().references("reverseAlias.id").onDelete("cascade"))
    .addColumn("alias", "text", col => col.notNull().references("alias.id").onDelete("cascade"))
    .addColumn("date", "date", col => col.notNull().defaultTo(sql`CURRENT_DATE`))
    .addPrimaryKeyConstraint("aliasquota_pkey", ["reverseAlias", "alias", "date"])
    .addColumn("incomingMailCount", "integer", col => col.notNull().defaultTo(0))
    .addColumn("outgoingMailCount", "integer", col => col.notNull().defaultTo(0))
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