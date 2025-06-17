<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import UserModifyDialog from '@/componentsV2/UserModifyDialog.vue';
import UserDeleteDialog from '@/componentsV2/UserDeleteDialog.vue';

const { stores } = defineProps<{ stores: Stores }>();

const deleteDialog = useTemplateRef('deleteDialog');
const modifyDialog = useTemplateRef('modifyDialog');
</script>

<template>
    <UserDeleteDialog ref="deleteDialog" :stores="stores" />
    <UserModifyDialog ref="modifyDialog" :stores="stores" /> 
    <span class="m-2 text-xl font-bold">Your Account</span>
    <div class="m-2 flex flex-col gap-2">
        <div class="flex flex-row items-center gap-2">
            <div><b>Username</b></div>
            <div>{{ stores.userStore.getKeyedObject(stores.perspective)?.username }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(stores.userStore.getKeyedObject(stores.perspective), ['username'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <div><b>Mail</b></div>
            <div>{{ stores.userStore.getKeyedObject(stores.perspective)?.mail }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(stores.userStore.getKeyedObject(stores.perspective), ['mail'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <div><b>Password</b></div>
            <div>{{ '************' }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(stores.userStore.getKeyedObject(stores.perspective), ['password'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <Button type="button" label="Delete" icon="pi pi-trash" severity="danger" @click="deleteDialog?.handleDelete(stores.userStore.getKeyedObject(stores.perspective))"></Button>
        </div>
    </div>
</template>