<script setup lang="ts">
import { aliasStore } from '@/api/aliasStore';
import { ref } from 'vue';

const show = ref(false);
const target = ref<string>("");
const fields = ref<any>({});

function handleDelete(destination: any) {
    target.value = destination.id;
    fields.value = {};
    Object.assign(fields.value, destination);
    show.value = true;
}
defineExpose({ handleDelete });

async function performDelete() {
    await aliasStore.delete(target.value);
    show.value = false;
}
</script>

<template>
    <Dialog v-model:visible="show" modal header="Delete Destination?" class="w-96">
        <Message icon="pi pi-exclamation-triangle" severity="warn" class="mt-1">Mails going to this destination will be rejected!</Message>
        <Message icon="pi pi-exclamation-triangle" severity="danger" class="mt-1">You CANNOT recreate the same alias after deletion!</Message>
        <div class="mt-2">Do you really want to delete this alias (<a class="text-blue-500">{{ fields.token + "@" + fields.domain }}</a>)?</div>
        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Abort" severity="secondary" variant="outlined" @click="show = false"></Button>
            <Button type="button" label="Delete" severity="danger" @click="performDelete()"></Button>
        </div>
        </Dialog>
</template>