<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import router from '@/Router';
import { Stores } from '@/api/Stores';
import DestinationDeleteDialog from '@/componentsV2/DestinationDeleteDialog.vue';
import DestinationModifyDialog from '@/componentsV2/DestinationModifyDialog.vue';
import Display from './Display.vue';

const props = defineProps<{
    load: () => Promise<void>,
    value: any,
    class?: any,
    admin?: boolean,
    stores: Stores
}>();

const expandedRows = ref([]);
const deleteDialog = useTemplateRef('deleteDialog');
const modifyDialog = useTemplateRef('modifyDialog');
onMounted(props.load);

const loading = ref(false);
</script>

<template>
    <DestinationDeleteDialog ref="deleteDialog" :stores="stores" />
    <DestinationModifyDialog ref="modifyDialog" :stores="stores" />
    <DataTable v-model:expandedRows="expandedRows" :value="value" :class="props.class" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-xl font-bold">Destinations</span>
                <div class="flex-grow"></div>
                <Button icon="pi pi-refresh" severity="info" rounded raised @click="loading = true; props.load().then(_ => loading = false)" />
                <Button icon="pi pi-plus" severity="success" rounded raised @click="modifyDialog?.handleCreate();" />
            </div>
        </template>
        <template #empty> No destinations found </template>
        <template #loading> Loading... </template>
        <Column header="Name" v-if="!props.admin">
            <template #body="slotProps">
                <Display :object="slotProps.data" />
            </template>
        </Column>
        <Column header="Category" v-if="!props.admin">
            <template #body="slotProps">
                <Display :object="stores.categoryStore.getKeyedObject(slotProps.data.categoryID)" :tag="true" />
            </template>
        </Column>
        <Column header="Address">
            <template #body="slotProps">
                {{ slotProps.data.mailBox + '@' + slotProps.data.mailDomain }}
            </template>
        </Column>
        <Column header="Verification">
            <template #body="slotProps">
                <Tag
                    :icon="slotProps.data.verified ? 'pi pi-check' : 'pi pi-exclamation-triangle'"
                    :value="slotProps.data.verified ? 'Verified' : 'Pending'"
                    :severity="slotProps.data.verified ? 'sucess' : 'warn'"
                />
                <Button icon="pi pi-refresh" rounded severity="warn" class="ml-2" size="small" v-if="!slotProps.data.verified" @click="stores.destinationStore.checkVerification(slotProps.data.id)" />
            </template>
        </Column>
        <Column header="UserID" v-if="props.admin">
            <template #body="slotProps">
                <div>{{ slotProps.data.userID }}</div>
            </template>
        </Column>
        <Column header="Enabled">
            <template #body="slotProps">
                <ToggleSwitch :defaultValue="slotProps.data.enabled" @value-change="newVal => stores.destinationStore.update(slotProps.data.id, { ...slotProps.data, enabled: newVal })" />
            </template>
        </Column>
       <Column expander style="width: 5rem" />
        <template #expansion="slotProps">
            <div class="flex flex-wrap items-center gap-2" v-if="!props.admin">
                <Button label="Edit" severity="info" icon="pi pi-pen-to-square" @click="modifyDialog?.handleUpdate(slotProps.data);" />
                <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deleteDialog?.handleDelete(slotProps.data)" />
            </div>
            <div class="flex flex-wrap items-center gap-2" v-if="props.admin">
                <Button label="View as user" severity="primary" icon="pi pi-eye" @click="router.push({ path: '/user/categories', query: { as: slotProps.data.userID }})" />
                <Button label="Delete" severity="danger" icon="pi pi-trash" @click="deleteDialog?.handleDelete(slotProps.data)" />
            </div>
        </template>
    </DataTable>
</template>