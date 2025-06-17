<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { categoryStore } from '@/api/CategoryStore';
import CategoryDeleteDialog from './CategoryDeleteDialog.vue';
import CategoryModifyDialog from './CategoryModifyDialog.vue';
import Display from './Display.vue';

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
</script>

<template>
    <CategoryDeleteDialog ref="deleteDialog" />
    <CategoryModifyDialog ref="modifyDialog" />
    <DataTable v-model:expandedRows="expandedRows" :value="value" :class="props.class" dataKey="id" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xl font-bold">Your Categories</span>
                <div class="flex-grow"></div>
                <Button icon="pi pi-refresh" severity="info" rounded raised @click="loading = true; props.load().then(_ => loading = false)" />
                <Button icon="pi pi-plus" severity="success" rounded raised @click="modifyDialog?.handleCreate();" />
            </div>
        </template>
        <template #empty> No categories found </template>
        <template #loading> Loading... </template>
        <Column header="Display">
            <template #body="slotProps">
                <Display :object="slotProps.data" :tag="true" />
            </template>
        </Column>
        <Column header="Enabled">
            <template #body="slotProps">
                <ToggleSwitch :defaultValue="slotProps.data.enabled" @value-change="newVal => categoryStore.update(slotProps.data.id, { ...slotProps.data, enabled: newVal })" />
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