import Cloudflare from 'cloudflare';

export let cloudflareClient:Cloudflare;

export async function initCloudflareClientFetchHandler(request: Request, env: any) {
    await initCloudflareClient(env as any); //Initialize DB
}

export async function initCloudflareClient(env: any) {
    cloudflareClient = new Cloudflare({
      apiToken: env["CLOUDFLARE_API_KEY"]
    });
    console.log("[initCloudflareClient]", `Initialized Cloudflare Client for '${env["CLOUDFLARE_API_MAIL"]}'!`);
}