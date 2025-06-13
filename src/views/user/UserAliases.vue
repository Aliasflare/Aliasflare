<script setup lang="ts">
import { AppState } from '@/AppState';
import { aliasStore } from '@/api/aliasStore';
import AliasTable from '@/componentsV2/AliasTable.vue';
import UserWrapper from './UserWrapper.vue';
import { destinationStore } from '@/api/DestinationStore';

async function load() {
    try {
        await aliasStore.list(AppState.currentUser.id, 0, 50);
        await destinationStore.list(AppState.currentUser.id, 0, 50);
    } catch(err) {}
}
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <UserWrapper>
        <AliasTable :load="load" :value="aliasStore.getKeyedObjects()" ></AliasTable>
    </UserWrapper>
</template>