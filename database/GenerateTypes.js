import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { spawn } from 'child_process';
import { getMigrations } from './Migrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const TEMP_DB_PATH = path.join(tmpdir(), 'kysely_codegen_temp.sqlite');

async function createTempDbFromMigrations() {
    const migrations = await getMigrations();

    console.log('[+] Creating temporary SQLite database...');
    const db = new Database(TEMP_DB_PATH);
  
    for (const [name, value] of Object.entries(migrations)) {
      console.log(`   → Applying migration: ${name}`);
      db.exec(value);
    }
  
    db.close();
    console.log('[✓] Migrations applied to temp DB.');
}

async function runKyselyCodegen() {
  console.log('[+] Running kysely-codegen...');
  return new Promise((resolve, reject) => {
    const proc = spawn('npx kysely-codegen', [
      '--out-file', path.resolve(import.meta.dirname, "./.generated/db.d.ts")
    ], { stdio: 'inherit', cwd: path.resolve(import.meta.dirname, "../"), env: { DATABASE_URL: TEMP_DB_PATH }, shell: true, stdio: 'inherit' });

    proc.on('exit', code => {
      if (code === 0) {
        console.log(`[✓] Types generated!`);
        resolve();
      } else {
        console.error('[x] kysely-codegen failed');
        reject(new Error(`kysely-codegen exited with code ${code}`));
      }
    });
  });
}

async function deleteTempDb() {
    console.log('[+] Deleting temp DB...');
    await fs.unlink(TEMP_DB_PATH);
    console.log('[✓] Temp DB deleted!');
}

async function run() {
    try {
      await createTempDbFromMigrations();
      await runKyselyCodegen();
    } finally {
      await deleteTempDb();
    }
  }
  
  run();