<script setup lang="ts">
import { onMounted, } from 'vue';
import { AppState } from '@/AppState';
import router from '@/Router';
import Logo from '@/componentsV2/Logo.vue';
import AuthBox from './AuthBox.vue';

onMounted(checkLogin);
async function checkLogin() {
    console.log("[AuthPrepareView]", "Fetching config...");
    const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify({
            user: AppState.authUserId
        })
    });
    if(res.status == 200) {
        AppState.config = (await res.json()).config;
        AppState.prepared = true;
        console.log("[AuthPrepareView]", "Fetched config!");
    } else {
        AppState.config = null;
        AppState.prepared = false;
        console.log("[AuthPrepareView]", "Failed to fetch config!");
    }

    //Check for updates if admin, but do not care about failures (no await!)
    (async() => {
        console.log("[UpdateCheck]", "Checking for updates...");
        if(!AppState.authUser.admin) return console.log("[UpdateCheck]", "User is not admin, skipping update check!");
        const gRes = await fetch(`https://api.github.com/repos/Aliasflare/Aliasflare/commits/master`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            }
        });
        if (!gRes.ok) return console.log("[UpdateCheck]", "Failed to fetch from GitHub:", gRes.status, gRes.statusText, await gRes.text());
        const data = await res.json();
        const sha = data.sha;

        if(AppState.config.commitSha == sha) return console.log("[UpdateCheck]", "Current commit is up to date:", sha);
        console.log("[UpdateCheck]", "New commit found:", sha);
        AppState.hasUpdate = true;
    })();

    setTimeout(() => router.push({ path: (router.currentRoute.value.query.originalPath as any)||'/' }), 500);
    return;
}
</script>

<template>
    <AuthBox class="AuthPrepareView">
        <div class="flex flex-col justify-center items-center">
            <Logo class="w-48 mb-4" />
            <div class="text-2xl text-center mb-4">Preparing app...</div>
            <div class="text-center mb-4">One second, we are fetching some things you need...</div>
            <Button variant="outlined" label="Preparing" :loading="true" />
        </div>
    </AuthBox>
</template>