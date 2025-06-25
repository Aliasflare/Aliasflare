<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import router from '@/Router';
import { APIClientPerspective } from '@/api/APIClient';
import CategoryDeleteDialog from './CategoryDeleteDialog.vue';
import CategoryModifyDialog from './CategoryModifyDialog.vue';
import Display from './Display.vue';

const props = defineProps<{
    load: () => Promise<void>,
    value: any,
    class?: any,
    admin?: boolean,
    client: APIClientPerspective
}>();

const expandedRows = ref([]);
const deleteDialog = useTemplateRef('deleteDialog');
const modifyDialog = useTemplateRef('modifyDialog');
onMounted(() => { loading.value = true; props.load().then(_ => loading.value = false) });

const loading = ref(false);
</script>

<template>
    <CategoryDeleteDialog ref="deleteDialog" :client="client" />
    <CategoryModifyDialog ref="modifyDialog" :client="client" />
    <DataTable v-model:expandedRows="expandedRows" :value="value" :class="props.class" dataKey="id" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xl font-bold">Categories</span>
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
                <ToggleSwitch :defaultValue="slotProps.data.enabled" @value-change="newVal => client.category.update(slotProps.data.id, { ...slotProps.data, enabled: newVal })" />
            </template>
        </Column>
        <Column expander style="width: 5rem" />
        <template #expansion="slotProps">
            <div class="flex flex-wrap items-center gap-2" v-if="!props.admin">
                <Button label="Edit" severity="info" icon="pi pi-pen-to-square" @click="modifyDialog?.handleUpdate(slotProps.data);" />
                <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deleteDialog?.handleDelete(slotProps.data)" />
            </div>
            <div class="flex flex-wrap items-center gap-2" v-if="props.admin">
                <Button label="View as user" severity="primary" icon="pi pi-eye" @click="router.push({ path: `/user/${slotProps.data.userID}/categories` })" />
                <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deleteDialog?.handleDelete(slotProps.data)" />
            </div>
        </template>
    </DataTable>
</template>