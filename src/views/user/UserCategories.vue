<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import CategoryTable from '@/componentsV2/CategoryTable.vue';

async function load() {
    try {
        await Stores.withPerspective(AppState.authUserId).categoryStore.list(AppState.authUserId, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <CategoryTable :load="load" :value="Stores.withPerspective(AppState.authUserId).categoryStore.getKeyedObjects()" :stores="Stores.withPerspective(AppState.authUserId)" />
</template>