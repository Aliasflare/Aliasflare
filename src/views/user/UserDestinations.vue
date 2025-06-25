<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import DestinationTable from '@/componentsV2/DestinationTable.vue';

const { client } = defineProps<{ client: APIClientPerspective }>();

async function load() {
    try {
        await client.destination.list(0, 50);
        await client.category.list(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <DestinationTable :load="load" :value="client.destination.getKeyedObjects()" :client="client" />
</template>