<script setup lang="ts">
import { AppState } from '@/AppState';
import { aliasStore } from '@/api/AliasStore';
import AliasTable from '@/componentsV2/AliasTable.vue';
import { destinationStore } from '@/api/DestinationStore';
import { categoryStore } from '@/api/CategoryStore';

async function load() {
    try {
        await aliasStore.list(AppState.currentUser.id, 0, 50);
        await destinationStore.list(AppState.currentUser.id, 0, 50);
        await categoryStore.list(AppState.currentUser.id, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AliasTable :load="load" :value="aliasStore.getKeyedObjects()" />
</template>