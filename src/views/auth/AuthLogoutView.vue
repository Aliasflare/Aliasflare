<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from '@/Router';
import Logo from '@/componentsV2/Logo.vue';
import AuthBox from './AuthBox.vue';
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

            <Message v-if="error" severity="error" icon="pi pi-times-circle" class="mb-4">{{ error }}</Message>
            <Message v-if="success" severity="success" icon="pi pi-check" class="mb-4">Logged out!</Message>

            <Button label="Login again" class="w-full" :loading="loading" @click="router.push({ path: '/auth/login', query: { originalPath: '/user/home' } })" raised />
        </div>
    </AuthBox>
</template>