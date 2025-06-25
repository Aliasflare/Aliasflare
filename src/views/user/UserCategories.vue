<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import CategoryTable from '@/componentsV2/CategoryTable.vue';

const { client } = defineProps<{ client: APIClientPerspective }>();

async function load() {
    try {
        await client.category.list(0, 50);
    } catch(err) {
        console.log(err);
    }
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <CategoryTable :load="load" :value="client.category.getKeyedObjects()" :client="client" />
</template>