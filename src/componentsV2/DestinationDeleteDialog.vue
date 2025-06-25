<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import { ref } from 'vue';

const { client } = defineProps<{ client: APIClientPerspective }>();
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
    await client.destination.delete(target.value);
    show.value = false;
}
</script>

<template>
    <Dialog v-model:visible="show" modal header="Delete Destination?" class="w-96">
        <Message icon="pi pi-exclamation-triangle" severity="warn" class="mt-1">Aliases using this destination will no longer accept mails!</Message>
        <div class="mt-2">Do you really want to delete this destination (<a class="text-blue-500">{{ fields.mailBox + "@" + fields.mailDomain }}</a>)?</div>
        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Abort" severity="secondary" variant="outlined" @click="show = false"></Button>
            <Button type="button" label="Delete" severity="danger" @click="performDelete()"></Button>
        </div>
    </Dialog>
</template>