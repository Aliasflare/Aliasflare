<script setup lang="ts">
import { AppState } from '@/AppState';
import UserTable from '@/componentsV2/UserTable.vue';

async function load() {
    try {
        await AppState.apiClient.withPerspective('ADMIN').user.listAll(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <UserTable :load="load" :value="AppState.apiClient.withPerspective('ADMIN').user.getKeyedObjects()" :client="AppState.apiClient.withPerspective('ADMIN')" />
</template>