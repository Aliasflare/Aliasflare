import { Kysely, ParseJSONResultsPlugin, Selectable } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { DB } from '../database/.generated/db';

export {DB};
export let db:Kysely<DB>|undefined;
export async function initDB(d1: D1Database) {
    //Create database object
    if(db) return console.warn("[initDB]", "D1 Database is already initialized!");
    db = new Kysely<DB>({ dialect: new D1Dialect({ database: d1 }), plugins: [ new ParseJSONResultsPlugin()] });
    console.log("[initDB]", "Initialized D1 Database!");
}

export async function initDBFetchHandler(request: Request, env: any) {
    await initDB(env.D1 as any); //Initialize DB
}

export type DBTable = keyof DB;
export type DBTableColumn<Table extends DBTable> = 
  Table extends keyof DB ? keyof DB[Table] : never;

export type DBTableFullObject<Table extends DBTable> = Selectable<DB[Table]>;

//TODO: Dynamically determine these
export const destinationColumns:any[] = ["id", "userID", "displayColor", "displayIcon", "displayName", "mailName", "mailBox", "mailDomain", "enabled", "verified", "cloudflareDestinationID", "updatedAt", "createdAt"];
export const categoryColumns:any[] = ["id", "userID", "displayColor", "displayIcon", "displayName", "enabled", "updatedAt", "createdAt"];
export const userColumns:any[] = ["id", "username", "mail", "passwordHash", "passwordSalt", "admin", "maxOutgoingPerDay", "maxIncomingPerDay", "maxAliasCount", "maxDestinationCount", "maxCategoryCount", "updatedAt", "createdAt"];