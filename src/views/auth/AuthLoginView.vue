<script setup lang="ts">
import { ref } from 'vue';
import router from '@/Router';
import Logo from '@/components/Logo.vue';
import AuthBox from './AuthBox.vue';
import MaterialSymbolsCheck from '~icons/material-symbols/check';
import MaterialSymbolsError from '~icons/material-symbols/error';
import MaterialSymbolsPerson from '~icons/material-symbols/person';
import MaterialSymbolsPassword from '~icons/material-symbols/password';
import { AppState } from '@/AppState';

const username = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<string|null>(null);
const success = ref<boolean>(false);

async function performLogin() {
    error.value = null;
    loading.value = true;
    success.value = false;
    const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    });
    if(res.status == 200) {
        loading.value = false;
        success.value = true;
        AppState.loggedIn = true;
        setTimeout(() => router.push({ path: router.currentRoute.value.query.originalPath as any }), 1000);
        return true;
    }
    error.value = (await res.json()).type;
    loading.value = false;
}

</script>

<template>
    <AuthBox class="AuthLoginView">
        <div class="flex flex-col justify-center items-center">
            <Logo class="w-48 mb-4"></Logo>
            <div class="text-2xl text-center mb-4">Login</div>

            <div role="alert" class="alert alert-error mb-4" v-if="error">
                <MaterialSymbolsError></MaterialSymbolsError>
                <span>{{ error }}</span>
            </div>

            <div role="alert" class="alert alert-success mb-4" v-if="success">
                <MaterialSymbolsCheck></MaterialSymbolsCheck>
                <span>Logged in! Redirecting...</span>
            </div>

            <label class="input mb-2">
                <MaterialSymbolsPerson></MaterialSymbolsPerson>
                <input type="text" placeholder="Max Mustermann" v-model="username" :disabled="loading||success" />
            </label>

            <label class="input mb-8">
                <MaterialSymbolsPassword></MaterialSymbolsPassword>
                <input type="password" placeholder="***********" v-model="password" :disabled="loading||success" />
            </label>

            <button class="btn btn-primary" @click="performLogin" :disabled="loading||success">
                <span class="loading loading-dots loading-md" v-if="loading"></span>
                <MaterialSymbolsCheck v-else-if="success"></MaterialSymbolsCheck>
                <a v-else>Login</a>
            </button>
        </div>
    </AuthBox>
</template>