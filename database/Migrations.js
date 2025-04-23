import { Kysely, SqliteDialect } from 'kysely'
import SQLite from 'better-sqlite3'
import fs from 'fs';
import path from 'path';
import fsProm from 'fs/promises';

const dialect = new SqliteDialect({ database: new SQLite(':memory:') });
const db = new Kysely({ dialect });

const JS_MIGRATIONS_DIR = "./migrations/";

export async function getMigrations() {
    const migrationFiles = (await fsProm.readdir(path.resolve(import.meta.dirname, JS_MIGRATIONS_DIR))).map(a => path.resolve(import.meta.dirname, JS_MIGRATIONS_DIR, a));
    console.log(`   → Found ${migrationFiles.length} migration files!`);
    const migrations = {};
    for(const migrationFile of migrationFiles) {
        const migration = await import("file://" + migrationFile);
        const upSqls = await migration.up(db);
        const asString = `-- Migration number: ${path.basename(migrationFile).split("_")[0]} ${fs.statSync(migrationFile).ctime.toISOString()}\n` + upSqls.map(a => a.sql).map(a => a + ";").join("\n\n");
        migrations[path.basename(migrationFile).split(".")[0]] = asString;
        console.log(`   → Loaded migration from '${migrationFile}'`);
    }
    return migrations;
}