<script setup lang="ts">
import { Stores } from '@/api/Stores';
import { ref } from 'vue';

const { stores } = defineProps<{ stores: Stores }>();
const deleteCount = ref(0);
const show = ref(false);
const target = ref<string>("");
const fields = ref<any>({});

function handleDelete(user: any) {
    target.value = user.id;
    fields.value = {};
    Object.assign(fields.value, user);
    show.value = true;
    deleteCount.value = 0;
}
defineExpose({ handleDelete });

async function performDelete() {
    if(deleteCount.value < 10) {
        deleteCount.value++;
        return;
    }
    await stores.userStore.delete(target.value);
    show.value = false;
}
</script>

<template>
    <Dialog v-model:visible="show" modal header="Do you really want to delete user?" class="w-96">
        <Message icon="pi pi-trash" severity="error" class="mt-2">Data is deleted <b>PERMANENTLY</b>!<br><b>THERE IS NO WAY TO RESTORE IT!!!</b></Message>
        <Message icon="pi pi-exclamation-triangle" severity="error" class="mt-2">Aliases are reserved and <b>CANNOT</b> be recreated on another account!</Message>
        <Message icon="pi pi-info-circle" severity="info" class="mt-2">Click delete <b>10 times</b> to confirm</Message>
        <div class="mt-2">Do you really want to delete this user (<a class="text-blue-500">{{ fields.username }}</a>)?</div>
        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Abort" severity="secondary" variant="outlined" @click="show = false"></Button>
            <Button type="button" :label="`Delete (${deleteCount}/10)`" severity="danger" @click="performDelete()"></Button>
        </div>
    </Dialog>
</template>