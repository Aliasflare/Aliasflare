<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import AliasTable from '@/componentsV2/AliasTable.vue';

async function load() {
    try {
        await Stores.withPerspective(AppState.authUserId).aliasStore.list(AppState.authUserId, 0, 50);
        await Stores.withPerspective(AppState.authUserId).destinationStore.list(AppState.authUserId, 0, 50);
        await Stores.withPerspective(AppState.authUserId).categoryStore.list(AppState.authUserId, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AliasTable :load="load" :value="Stores.withPerspective(AppState.authUserId).aliasStore.getKeyedObjects()" :stores="Stores.withPerspective(AppState.authUserId)" />
</template>