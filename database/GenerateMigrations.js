import fs from 'fs';
import path from 'path';
import fsProm from 'fs/promises';
import { getMigrations } from './Migrations.js';

const SQL_MIGRATIONS_DIR = "./.generated/migrations/";
(async() => {
    if(fs.existsSync(path.resolve(import.meta.dirname, SQL_MIGRATIONS_DIR))) {
        console.log("[+] Clearing migrations folder...");
        await fsProm.rm(path.resolve(import.meta.dirname, SQL_MIGRATIONS_DIR), { recursive: true });
        await fsProm.mkdir(path.resolve(import.meta.dirname, SQL_MIGRATIONS_DIR), { recursive: true });
        console.log("[✓] Migrations folder cleared!");
    } else {
        console.log("[+] Creating migrations folder...");
        await fsProm.mkdir(path.resolve(import.meta.dirname, SQL_MIGRATIONS_DIR));
        console.log("[✓] Migrations folder created!");
    }

    console.log("[+] Loading migrations...");
    const migrations = await getMigrations();
    console.log("[✓] Migrations loaded!");

    console.log("[+] Writing migration files...");
    for(const [name, value] of Object.entries(migrations)) {
        const targetFile = path.resolve(import.meta.dirname, SQL_MIGRATIONS_DIR + name + ".sql");
        await fsProm.writeFile(targetFile, value);
        console.log(`   → Wrote '${targetFile}'`);
    }
})();