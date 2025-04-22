<script setup lang="ts">
import { onMounted, } from 'vue';
import { AppState } from '@/AppState';
import router from '@/Router';
import Logo from '@/components/Logo.vue';
import AuthBox from './AuthBox.vue';

onMounted(checkLogin);
async function checkLogin() {
    console.log("[AuthCheckingView]", "Checking auth...");
    const res = await fetch("/api/user/get", {
        method: "POST",
        body: JSON.stringify({
            self: true
        })
    });
    if(res.status == 200) {
        AppState.authChecked = true;
        AppState.loggedIn = true;
        AppState.currentUser = (await res.json()).user;
        console.log("[AuthCheckingView]", "User is logged in!");
    } else {
        AppState.authChecked = true;
        AppState.loggedIn = false;
        AppState.currentUser = null;
        console.log("[AuthCheckingView]", "User is logged out!");
    }
    setTimeout(() => router.push({ path: router.currentRoute.value.query.originalPath as any }), 500);
    return;
}
</script>

<template>
    <AuthBox class="AuthCheckingView">
        <div class="flex flex-col justify-center items-center">
            <Logo class="w-48 mb-4"></Logo>
            <div class="text-2xl text-center mb-4">Checking Auth...</div>
            <div class="text-center mb-4">One second, we are validating you are really logged in and ready to go...</div>
            <span class="loading loading-dots loading-md"></span>
        </div>
    </AuthBox>
</template>