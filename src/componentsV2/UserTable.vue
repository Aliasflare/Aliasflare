<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import UserDeleteDialog from './UserDeleteDialog.vue';
import UserModifyDialog from './UserModifyDialog.vue';

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
    <UserDeleteDialog ref="deleteDialog" />
    <UserModifyDialog ref="modifyDialog" />
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
        <Column header="Username">
            <template #body="slotProps">
                <div>{{ slotProps.data.username }}</div>
            </template>
        </Column>
        <Column header="Mail">
            <template #body="slotProps">
                <div>{{ slotProps.data.mail }}</div>
            </template>
        </Column>
        <Column header="Admin">
            <template #body="slotProps">
                <div>{{ slotProps.data.admin ? 'YES' : 'NO' }}</div>
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