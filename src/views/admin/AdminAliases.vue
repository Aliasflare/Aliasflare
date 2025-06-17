<script setup lang="ts">
import { Stores } from '@/api/Stores';
import AliasTable from '@/componentsV2/AliasTable.vue';

async function load() {
    try {
        await Stores.withPerspective('ADMIN').aliasStore.listAll(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AliasTable :load="load" :value="Stores.withPerspective('ADMIN').aliasStore.getKeyedObjects()" :stores="Stores.withPerspective('ADMIN')" :admin="true" />
</template>