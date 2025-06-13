<script setup lang="ts">
import { AppState } from '@/AppState';
import { categoryStore } from '@/api/CategoryStore';
import CategoryTable from '@/componentsV2/CategoryTable.vue';

async function load() {
    try {
        await categoryStore.list(AppState.currentUser.id, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <CategoryTable :load="load" :value="categoryStore.getKeyedObjects()" />
</template>