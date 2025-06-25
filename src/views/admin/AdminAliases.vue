<script setup lang="ts">
import { AppState } from '@/AppState';
import AliasTable from '@/componentsV2/AliasTable.vue';

async function load() {
    try {
        await AppState.apiClient.withPerspective('ADMIN').alias.listAll(0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AliasTable :load="load" :value="AppState.apiClient.withPerspective('ADMIN').alias.getKeyedObjects()" :client="AppState.apiClient.withPerspective('ADMIN')" :admin="true" />
</template>