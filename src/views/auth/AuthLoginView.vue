<script setup lang="ts">
import { ref } from 'vue';
import router from '@/Router';
import Logo from '@/componentsV2/Logo.vue';
import AuthBox from './AuthBox.vue';
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
        AppState.authChecked = false;
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

            <Message v-if="error" severity="error" icon="pi pi-times-circle" class="mb-4">{{ error }}</Message>
            <Message v-if="success" severity="success" icon="pi pi-check" class="mb-4">Logged in! Redirecting...</Message>

            <InputGroup class="mb-2">
                <InputGroupAddon>
                    <i class="pi pi-user" />
                </InputGroupAddon>
                <IftaLabel>
                    <InputText id="username" v-model="username" type="username" variant="filled" />
                    <label for="username">Username</label>
                </IftaLabel>
            </InputGroup>

            <InputGroup class="mb-4">
                <InputGroupAddon>
                    <i class="pi pi-key"></i>
                </InputGroupAddon>
                <IftaLabel>
                    <InputText id="password" v-model="password" type="password" variant="filled" />
                    <label for="password">Password</label>
                </IftaLabel>
            </InputGroup>

            <Button label="Login" class="w-full" :loading="loading" @click="performLogin()" raised />
        </div>
    </AuthBox>
</template>