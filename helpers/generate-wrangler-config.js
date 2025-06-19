import fs from 'fs';
import path from 'path';
import Listr from 'listr';
import { Cloudflare } from 'cloudflare';
import 'dotenv/config';

const cf = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN });

const tasks = new Listr([
  {
    title: 'Check environment variables',
    task: () => new Listr([
      { title: 'CLOUDFLARE_API_TOKEN', task: (ctx, task) => { if (!process.env.CLOUDFLARE_API_TOKEN) throw new Error('Missing CLOUDFLARE_API_TOKEN in environment'); } },
      { title: 'CLOUDFLARE_DOMAINS', task: (ctx, task) => { if (!process.env.CLOUDFLARE_DOMAINS) throw new Error('Missing CLOUDFLARE_DOMAINS in environment'); ctx.DOMAINS = process.env.CLOUDFLARE_DOMAINS.split(',').filter(Boolean); } },
    ])
  },
  {
    title: 'Get Account ID',
    task: async(ctx, task) => {
      const res = await cf.accounts.list();
      const account = res.result[0];
      if(!account) throw new Error('No account found for this API token');
      ctx.ACCOUNT = account;
    }
  },
  {
    title: 'Setup D1 Database',
    task: () => new Listr([
      { title: 'Check for existing D1 Database', task: async(ctx, task) => { ctx.DATABASE = (await cf.d1.database.list({ account_id: ctx.ACCOUNT.id })).result.find(a => a.name == (process.env.CLOUDFLARE_DATABASE_NAME || "aliasflare")); } },
      { title: 'Create D1 Database', skip: ctx => ctx.DATABASE, task: async(ctx, task) => { ctx.DATABASE = await cf.d1.database.create({ account_id: ctx.ACCOUNT.id, name: (process.env.CLOUDFLARE_DATABASE_NAME || "aliasflare") }); }}
    ])
  },
  {
    title: 'Setup Worker',
    task: () => new Listr([
      { title: 'Check for existing Worker', task: async(ctx, task) => { ctx.WORKER = (await cf.workers.scripts.list({ account_id: ctx.ACCOUNT.id })).result.find(a => a.id == (process.env.CLOUDFLARE_WORKER_NAME || "aliasflare")); } },
      { title: 'Create Worker', skip: async(ctx, task) => ctx.WORKER, task: async(ctx, task) => { throw new Error('Worker creation is not implemented in this script. Please create worker manually using the Cloudflare dashboard.'); } },
      {
        title: 'Set Worker Secrets',
        skip: _ => !process.env.FOR_DEPLOY,
        task: () => new Listr([
          { title: 'CLOUDFLARE_API_TOKEN', task: async(ctx, task) => { await cf.workers.scripts.secrets.update(ctx.WORKER.id, { account_id: ctx.ACCOUNT.id, name: 'CLOUDFLARE_API_TOKEN', text: process.env.CLOUDFLARE_API_TOKEN, type: 'secret_text' }); } },
          { title: 'CLOUDFLARE_ACCOUNT_ID', task: async(ctx, task) => {await cf.workers.scripts.secrets.update(ctx.WORKER.id, { account_id: ctx.ACCOUNT.id, name: 'CLOUDFLARE_ACCOUNT_ID', text: ctx.ACCOUNT.id, type: 'secret_text' }); } },
          { title: 'MAILGUN_API_KEY', task: async(ctx, task) => { await cf.workers.scripts.secrets.update(ctx.WORKER.id, { account_id: ctx.ACCOUNT.id, name: 'MAILGUN_API_KEY', text: process.env.MAILGUN_API_KEY || "DISABLED", type: 'secret_text' }); } },
        ])
      },
    ])
  },
  {
    title: 'Setup Domains',
    task: (pCtx) => new Listr(
      pCtx.DOMAINS.map(domain => ({
        title: domain,
        task: () => new Listr([
          { title: "Get Domain", task: async(ctx, task) => { ctx.DOMAIN = (await cf.zones.list({ account_id: ctx.ACCOUNT.id })).result.find(a => a.name == domain); if(!ctx.DOMAIN) throw new Error("Domain not found"); } },
          { title: "Enable email routing", task: async(ctx, task) => { await cf.emailRouting.enable({ zone_id: ctx.DOMAIN.id }); } },
          { title: "Add dns records", task: async(ctx, task) => { await cf.emailRouting.dns.create({ zone_id: ctx.DOMAIN.id, name: "mail." + ctx.DOMAIN.name }); } },
          //TODO: { title: "Add routing rule", task: async(ctx, task) => { await cf.emailRouting.rules.create({ zone_id: ctx.DOMAIN.id, actions: [{ type: "worker", value: [ctx.WORKER.id] }], matchers: [{ type: 'all' }], name: "Aliasflare" }) } }
        ])
      }))
    )
  },
  {
    title: 'Generate Wrangler Config',
    task: async(ctx, task) => { 
      const config = {
        $schema: "node_modules/wrangler/config-schema.json",
        name: ctx.WORKER.id,
        compatibility_date: "2025-04-16",
        main: "server/index.ts",
        assets: {
          not_found_handling: "single-page-application"
        },
        observability: {
          enabled: true
        },
        compatibility_flags: ["nodejs_compat"],
        d1_databases: [
          {
            binding: "D1",
            database_name: ctx.DATABASE.name,
            database_id: ctx.DATABASE.uuid,
            preview_database_id: "D1",
            migrations_dir: "./database/.generated/migrations"
          }
        ],
        routes: ctx.DOMAINS.map(domain => ({
          pattern: domain.trim(),
          custom_domain: true
        })),
        send_email: [
          {
            name: "email"
          }],
        vars: {
          domains: ctx.DOMAINS.join(","),
          defaultIncomingQuotaPerDay: 100,
          defaultOutgoingQuotaPerDay: 10,
          commitSha: process.env.COMMIT_SHA || "unknown",
        }
      };

      const configPath = path.resolve('./wrangler.jsonc');
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
  }
]);
tasks.run();