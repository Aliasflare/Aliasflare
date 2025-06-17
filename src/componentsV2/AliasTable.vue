<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import router from '@/Router';
import { aliasStore } from '@/api/AliasStore';
import { destinationStore } from '@/api/DestinationStore';
import AliasDeleteDialog from './AliasDeleteDialog.vue';
import AliasModifyDialog from '@/componentsV2/AliasModifyDialog.vue';
import Display from './Display.vue';
import { categoryStore } from '@/api/CategoryStore';
import { useToast } from 'primevue/usetoast';

const props = defineProps<{
    load: () => Promise<void>,
    value: any,
    class?: any
}>();

const expandedRows = ref([]);
const deleteDialog = useTemplateRef('deleteDialog');
const modifyDialog = useTemplateRef('modifyDialog');
onMounted(props.load);

const loading = ref(false);

const toast = useToast();
function handleAliasCopy(slotProps: any) {
    navigator.clipboard.writeText(slotProps.data.token + '@' + slotProps.data.domain);
    toast.add({ severity: 'success', summary: 'Copied Alias to clipboard', life: 2000 })
}
</script>

<template>
    <Toast />
    <AliasDeleteDialog ref="deleteDialog" />
    <AliasModifyDialog ref="modifyDialog" />
    <DataTable v-model:expandedRows="expandedRows" :value="value" :class="props.class" tableStyle="min-width: 50rem" :loading="loading">
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
        <Column header="Name">
            <template #body="slotProps">
                <Display :object="slotProps.data" />
            </template>
        </Column>
        <Column header="Category">
            <template #body="slotProps">
                <Display :object="categoryStore.getKeyedObject(slotProps.data.categoryID)" :tag="true" />
            </template>
        </Column>
        <Column header="Address">
            <template #body="slotProps">
                <div class="flex items-center">
                    <div class="mr-2">{{ slotProps.data.token + '@' + slotProps.data.domain }}</div>
                    <Button icon="pi pi-copy" severity="secondary" aria-label="Copy" size="small" @click="handleAliasCopy(slotProps)" />
                </div>
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