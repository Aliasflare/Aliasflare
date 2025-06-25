<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import { ref } from 'vue';

const { client } = defineProps<{ client: APIClientPerspective }>();
const show = ref(false);
const target = ref<string>("");
const fields = ref<any>({});

function handleDelete(category: any) {
    target.value = category.id;
    fields.value = {};
    Object.assign(fields.value, category);
    show.value = true;
}
defineExpose({ handleDelete });

async function performDelete() {
    await client.category.delete(target.value);
    show.value = false;
}
</script>

<template>
    <Dialog v-model:visible="show" modal header="Delete Category?" class="w-96">
        <div class="mt-2">Do you really want to delete this category (<a class="text-blue-500">{{ fields.displayName }}</a>)?</div>
        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Abort" severity="secondary" variant="outlined" @click="show = false"></Button>
            <Button type="button" label="Delete" severity="danger" @click="performDelete()"></Button>
        </div>
    </Dialog>
</template>