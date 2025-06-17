<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import DestinationTable from '@/componentsV2/DestinationTable.vue';

const { stores } = defineProps<{ stores: Stores }>();

async function load() {
    try {
        await stores.destinationStore.list(AppState.viewAsUserId, 0, 50);
        await stores.categoryStore.list(AppState.viewAsUserId, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <DestinationTable :load="load" :value="stores.destinationStore.getKeyedObjects()" :stores="stores" />
</template>