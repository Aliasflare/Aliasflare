<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from '@/Router';
import Logo from '@/components/Logo.vue';
import AuthBox from './AuthBox.vue';
import MaterialSymbolsCheck from '~icons/material-symbols/check';
import MaterialSymbolsError from '~icons/material-symbols/error';
import { AppState } from '@/AppState';

const loading = ref<boolean>(false);
const error = ref<string|null>(null);
const success = ref<boolean>(false);

onMounted(performLogout);
async function performLogout() {
    error.value = null;
    loading.value = true;
    success.value = false;
    const res = await fetch("/api/auth/logout", {
        method: "POST",
    });
    if(res.status == 200) {
        loading.value = false;
        success.value = true;
        AppState.loggedIn = false;
        AppState.authChecked = false;
        return true;
    }
    error.value = (await res.json()).type;
    loading.value = false;
}
</script>

<template>
    <AuthBox class="AuthLogoutView">
        <div class="flex flex-col justify-center items-center">
            <Logo class="w-48 mb-4"></Logo>
            <div class="text-2xl text-center mb-4">Logout</div>

            <div role="alert" class="alert alert-error mb-4" v-if="error">
                <MaterialSymbolsError></MaterialSymbolsError>
                <span>{{ error }}</span>
            </div>

            <div role="alert" class="alert alert-success mb-4" v-if="success">
                <MaterialSymbolsCheck></MaterialSymbolsCheck>
                <span>Logged out!</span>
            </div>

            <button class="btn btn-primary" @click="router.push({ path: '/auth/login', query: { originalPath: '/user/home' } })" :disabled="loading">Login</button>
        </div>
    </AuthBox>
</template>