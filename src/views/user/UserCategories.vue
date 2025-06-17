<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import CategoryTable from '@/componentsV2/CategoryTable.vue';

const { stores } = defineProps<{ stores: Stores }>();

async function load() {
    try {
        await stores.categoryStore.list(AppState.viewAsUserId, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <CategoryTable :load="load" :value="stores.categoryStore.getKeyedObjects()" :stores="stores" />
</template>