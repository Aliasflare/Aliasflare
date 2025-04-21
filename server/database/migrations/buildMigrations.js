import SQLite from 'better-sqlite3'
import fs from 'fs';
import path from 'path';
import { Kysely, SqliteDialect } from 'kysely'

const dialect = new SqliteDialect({
  database: new SQLite(':memory:'),
})

const db = new Kysely({ dialect });

(async() => {
    const files = fs.readdirSync(path.resolve(import.meta.dirname));
    fs.rmdirSync(path.resolve(import.meta.dirname, "../../../migrations/"), { recursive: true });
    fs.mkdirSync(path.resolve(import.meta.dirname, "../../../migrations/"));
    const migrationFiles = files.filter(a => a!="buildMigrations.js" && a!="index.js").map(a => path.resolve(import.meta.dirname, a));
    console.log("[buildMigrations]", `Found ${migrationFiles.length} migration files!`);
    for(const migrationFile of migrationFiles) {
        const targetFile = path.resolve(import.meta.dirname, "../../../migrations/" + path.basename(migrationFile).split(".")[0] + ".sql");
        const migration = await import("file://" + migrationFile);
        const upSqls = await migration.up(db);
        fs.writeFileSync(targetFile, `-- Migration number: ${path.basename(migrationFile).split("_")[0]} 	 ${fs.statSync(migrationFile).ctime.toISOString()}\n` + upSqls.map(a => a.sql).map(a => a + ";").join("\n\n"));
        console.log("[buildMigrations]", `Wrote '${targetFile}' from '${migrationFile}'`);
    }
})();
