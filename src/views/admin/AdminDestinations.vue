<script setup lang="ts">
import { AppState } from '@/AppState';
import DestinationTable from '@/componentsV2/DestinationTable.vue';

async function load() {
    try {
        await AppState.apiClient.withPerspective('ADMIN').destination.listAll(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <DestinationTable :load="load" :value="AppState.apiClient.withPerspective('ADMIN').destination.getKeyedObjects()" :client="AppState.apiClient.withPerspective('ADMIN')" :admin="true" />
</template>