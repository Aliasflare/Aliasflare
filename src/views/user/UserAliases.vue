<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import AliasTable from '@/componentsV2/AliasTable.vue';

const { client } = defineProps<{ client: APIClientPerspective }>();

async function load() {
    try {
        await client.alias.list(0, 50);
        await client.destination.list(0, 50);
        await client.category.list(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AliasTable :load="load" :value="client.alias.getKeyedObjects()" :client="client" />
</template>