<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import router from '@/Router';
import { aliasStore } from '@/api/AliasStore';
import { destinationStore } from '@/api/DestinationStore';
import AliasDeleteDialog from './AliasDeleteDialog.vue';
import AliasModifyDialog from '@/componentsV2/AliasModifyDialog.vue';
import Display from './Display.vue';
import { categoryStore } from '@/api/CategoryStore';

const props = defineProps<{
    load: () => Promise<void>,
    value: any,
    class?: any
}>();

const expandedRows = ref([]);
const expandedRowGroups = ref([]);
const deleteDialog = useTemplateRef('deleteDialog');
const modifyDialog = useTemplateRef('modifyDialog');
onMounted(props.load);

const loading = ref(false);
</script>

<template>
    <AliasDeleteDialog ref="deleteDialog" />
    <AliasModifyDialog ref="modifyDialog" />
    <DataTable v-model:expandedRows="expandedRows" v-model:expandedRowGroups="expandedRowGroups" :value="value" :class="props.class" tableStyle="min-width: 50rem" :loading="loading" expandableRowGroups rowGroupMode="subheader" groupRowsBy="categoryID">
        <template #header>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xl font-bold">Your Aliases</span>
                <div class="flex-grow"></div>
                <Button icon="pi pi-refresh" severity="info" rounded raised @click="loading = true; props.load().then(_ => loading = false)" />
                <Button icon="pi pi-plus" severity="success" rounded raised @click="modifyDialog?.handleCreate();" />
            </div>
        </template>
        <template #empty> No aliases found </template>
        <template #loading> Loading... </template>
        <template #groupheader="slotProps">
            <div class="inline-block ml-2">
                <Display :object="categoryStore.getKeyedObject(slotProps.data.categoryID)" />
            </div>
        </template>
        <Column field="categoryID" header="Category"></Column>
        <Column header="Display" style="width: 16px;">
            <template #body="slotProps">
                <Display :object="slotProps.data" />
            </template>
        </Column>
        <Column header="Address">
            <template #body="slotProps">
                {{ slotProps.data.token + '@' + slotProps.data.domain }}
            </template>
        </Column>
        <Column header="Destination">
            <template #body="slotProps">
                <Display class="hover:cursor-alias hover:underline" :object="destinationStore.getKeyedObject(slotProps.data.destinationID)" @click="router.push('/user/destinations#' + slotProps.data.destinationID)"></Display>
            </template>
        </Column>
        <Column header="Enabled">
            <template #body="slotProps">
                <ToggleSwitch :defaultValue="slotProps.data.enabled" @value-change="newVal => aliasStore.update(slotProps.data.id, { ...slotProps.data, enabled: newVal })" />
            </template>
        </Column>
        <Column expander style="width: 5rem" />
        <template #expansion="slotProps">
            <div class="flex flex-wrap items-center gap-2">
                <Button label="Edit" severity="info" icon="pi pi-pen-to-square" @click="modifyDialog?.handleUpdate(slotProps.data);" />
                <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deleteDialog?.handleDelete(slotProps.data)" />
            </div>
        </template>
    </DataTable>
</template>