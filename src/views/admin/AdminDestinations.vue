<script setup lang="ts">
import { Stores } from '@/api/Stores';
import DestinationTable from '@/componentsV2/DestinationTable.vue';

async function load() {
    try {
        await Stores.withPerspective('ADMIN').destinationStore.listAll(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <DestinationTable :load="load" :value="Stores.withPerspective('ADMIN').destinationStore.getKeyedObjects()" :stores="Stores.withPerspective('ADMIN')" :admin="true" />
</template>