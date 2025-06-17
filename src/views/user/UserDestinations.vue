<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import DestinationTable from '@/componentsV2/DestinationTable.vue';

async function load() {
    try {
        await Stores.withPerspective(AppState.authUserId).destinationStore.list(AppState.authUserId, 0, 50);
        await Stores.withPerspective(AppState.authUserId).categoryStore.list(AppState.authUserId, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <DestinationTable :load="load" :value="Stores.withPerspective(AppState.authUserId).destinationStore.getKeyedObjects()" :stores="Stores.withPerspective(AppState.authUserId)" />
</template>