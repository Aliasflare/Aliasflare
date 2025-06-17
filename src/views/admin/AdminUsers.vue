<script setup lang="ts">
import { AppState } from '@/AppState';
import { userStore } from '@/api/UserStore';
import UserTable from '@/componentsV2/UserTable.vue';

async function load() {
    try {
        await userStore.list(AppState.currentUser.id, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <UserTable :load="load" :value="userStore.getKeyedObjects()" />
</template>