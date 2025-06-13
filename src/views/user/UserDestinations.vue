<script setup lang="ts">
import { AppState } from '@/AppState';
import { destinationStore } from '@/api/DestinationStore';
import DestinationTable from '@/componentsV2/DestinationTable.vue';

async function load() {
    try {
        await destinationStore.list(AppState.currentUser.id, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <DestinationTable :load="load" :value="destinationStore.getKeyedObjects()" ></DestinationTable>
</template>