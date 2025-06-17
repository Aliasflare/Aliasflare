<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import AliasTable from '@/componentsV2/AliasTable.vue';

const { stores } = defineProps<{ stores: Stores }>();

async function load() {
    try {
        await stores.aliasStore.list(stores.perspective, 0, 50);
        await stores.destinationStore.list(stores.perspective, 0, 50);
        await stores.categoryStore.list(stores.perspective, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AliasTable :load="load" :value="stores.aliasStore.getKeyedObjects()" :stores="stores" />
</template>