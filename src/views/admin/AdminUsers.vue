<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import UserTable from '@/componentsV2/UserTable.vue';

async function load() {
    try {
        await Stores.withPerspective('ADMIN').userStore.listAll(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <UserTable :load="load" :value="Stores.withPerspective('ADMIN').userStore.getKeyedObjects()" :stores="Stores.withPerspective('ADMIN')" />
</template>