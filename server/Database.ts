import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { DB } from '../database/.generated/db';

export let db:Kysely<DB>|undefined;
export async function initDB(d1: D1Database) {
    //Create database object
    if(db) return console.warn("[initDB]", "D1 Database is already initialized!");
    db = new Kysely<DB>({ dialect: new D1Dialect({ database: d1 }) });
    console.log("[initDB]", "Initialized D1 Database!");
}

export async function initDBFetchHandler(request: Request, env: any) {
    await initDB(env.D1 as any); //Initialize DB
}