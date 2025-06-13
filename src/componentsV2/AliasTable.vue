<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { aliasStore } from '@/api/aliasStore';
import AliasDeleteDialog from './AliasDeleteDialog.vue';
import AliasModifyDialog from '@/componentsV2/AliasModifyDialog.vue';
import { destinationStore } from '@/api/DestinationStore';

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
    <AliasDeleteDialog ref="deleteDialog" />
    <AliasModifyDialog ref="modifyDialog" />
    <DataTable v-model:expandedRows="expandedRows" :value="value" :class="props.class" dataKey="id" tableStyle="min-width: 50rem" :loading="loading">
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
        <Column header="Color" style="width: 16px;">
            <template #body="slotProps">
                <ColorPicker :modelValue="slotProps.data.displayColor||'#000000'" class="pointer-events-none"></ColorPicker>
            </template>
        </Column>
        <Column header="Icon" style="width: 16px;">
            <template #body="slotProps">
                <i v-if="slotProps.data.displayIcon" :class="`pi pi-${slotProps.data.displayIcon}`"></i>
                <a v-else>/</a>
            </template>
        </Column>
        <Column header="Name">
            <template #body="slotProps">
                {{ slotProps.data.displayName||"(Unnamed)" }}
            </template>
        </Column>
        <Column header="Address">
            <template #body="slotProps">
                {{ slotProps.data.token + '@' + slotProps.data.domain }}
            </template>
        </Column>
        <Column header="Destination">
            <template #body="slotProps">
                <div class="flex items-center">
                    <ColorPicker :modelValue="destinationStore.getKeyedObject(slotProps.data.destinationID)?.displayColor" v-if="destinationStore.getKeyedObject(slotProps.data.destinationID)" class="pointer-events-none mr-2"></ColorPicker>
                    <i :class="`pi pi-${destinationStore.getKeyedObject(slotProps.data.destinationID)?.displayIcon||'question'} mr-2`"></i>
                    <div>{{ destinationStore.getKeyedObject(slotProps.data.destinationID)?.displayName || "(Unassigned)" }}</div>
                </div>
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