import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { Cloudflare } from 'cloudflare';

if (!process.env.CLOUDFLARE_DOMAINS) throw new Error('Missing CLOUDFLARE_DOMAINS in environment');
if (!process.env.CLOUDFLARE_API_TOKEN) throw new Error('Missing CLOUDFLARE_API_TOKEN in environment');
const cf = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN });

async function getAccountId() {
  console.log("🔍 Fetching Cloudflare account ID...");
  const res = await cf.accounts.list();
  if (!res.body.success || !res.result?.length) {
    throw new Error('No accounts found for this api token');
  }
  const account = res.result[0];
  console.log(`✅ Found account: ${account.name} with ID "${account.id}"`);
  return account.id;
}

async function getOrCreateD1Database(accountId, dbName) {
  console.log(`🔍 Checking if D1 database "${dbName}" exists...`);
  const databases = await cf.d1.database.list({ account_id: accountId });
  const existing = databases.result.find((db) => db.name === dbName);

  if (existing) {
    console.log(`✅ D1 database "${dbName}" exists!`);
    return existing;
  } else console.log(`❌ D1 database "${dbName}" does not exist!`);

  console.log(`⏳ Creating D1 database "${dbName}"...`);
  const created = await cf.d1.database.create({ account_id: accountId, name: dbName });
  console.log(`✅ Created D1 database "${dbName}" with ID "${created.uuid}"!`);
  return created.result;
}

async function getOrCreateWorker(accountId, workerName) {
  console.log(`🔍 Checking if worker "${workerName}" exists...`);
  const workers = await cf.workers.scripts.list({ account_id: accountId });
  const existing = workers.result.find((w) => w.id === workerName);

  if (existing) {
    console.log(`✅ Worker "${workerName}" exists!`);
    return existing;
  } else console.log(`❌ Worker "${workerName}" does not exist!`);

  console.log(`⏳ Creating Worker "${workerName}"...`);
  throw new Error("Worker creation is not implemented in this script. Please create worker manually using the Cloudflare dashboard.");

  console.log(`✅ Created Worker "${worker.id}"!`);
  return worker;
}

async function setWorkerSecret(accountId, workerId, secretName, secretValue) {
  if(!process.env.FOR_DEPLOY) return console.log(`⚠️ Skipped worker secret "${secretName}" on "${workerId}" because this config is not for deployment!`);
  console.log(`⏳ Setting worker secret "${secretName}" on "${workerId}"...`);
  await cf.workers.scripts.secrets.update(workerId, {
    account_id: accountId,
    name: secretName,
    text: secretValue,
    type: 'secret_text',
  });
  console.log(`✅ Set worker secret "${secretName}" on "${workerId}"!`);
}

function generateWranglerConfig(accountId, worker, database, domains) {
  const config = {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": worker.id,
    "compatibility_date": "2025-04-16",
    "main": "server/index.ts",
    "assets": {
      "not_found_handling": "single-page-application"
    },
    "observability": {
      "enabled": true
    },
    "compatibility_flags": ["nodejs_compat"],
    "d1_databases": [
      {
        "binding": "D1",
        "database_name": database.name,
        "database_id": database.uuid,
        "preview_database_id": "D1",
        "migrations_dir": "./database/.generated/migrations"
      }
    ],
    "routes": domains.map(domain => ({
      pattern: domain.trim(),
      custom_domain: true
    })),
    "send_email": [
      { "name": "email" }
    ],
    "vars": {
      "domains": domains.join(","),
      "defaultIncomingQuotaPerDay": 100,
      "defaultOutgoingQuotaPerDay": 10,
    }
  };

  const configPath = path.resolve('./wrangler.jsonc');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Generated wrangler.jsonc at ${configPath}`);
}

(async () => {
  try {
    const accountId = await getAccountId();
    const db = await getOrCreateD1Database(accountId, process.env.CLOUDFLARE_WORKER_NAME || "aliasflare");
    const worker = await getOrCreateWorker(accountId, process.env.CLOUDFLARE_DATABASE_NAME || "aliasflare");
    await setWorkerSecret(accountId, worker.id, 'CLOUDFLARE_API_TOKEN', process.env.CLOUDFLARE_API_TOKEN);
    await setWorkerSecret(accountId, worker.id, 'CLOUDFLARE_ACCOUNT_ID', accountId);
    await setWorkerSecret(accountId, worker.id, 'mailgun', process.env.MAILGUN_API_KEY||"DISABLED");
    const domains = process.env.CLOUDFLARE_DOMAINS.split(',').filter(Boolean);
    generateWranglerConfig(accountId, worker, db, domains);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
