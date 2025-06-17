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