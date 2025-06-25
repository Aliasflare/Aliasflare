<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { APIClientPerspective } from '@/api/APIClient';
import UserModifyDialog from '@/componentsV2/UserModifyDialog.vue';
import UserDeleteDialog from '@/componentsV2/UserDeleteDialog.vue';

const { client } = defineProps<{ client: APIClientPerspective }>();

const deleteDialog = useTemplateRef('deleteDialog');
const modifyDialog = useTemplateRef('modifyDialog');
</script>

<template>
    <UserDeleteDialog ref="deleteDialog" :client="client" />
    <UserModifyDialog ref="modifyDialog" :client="client" /> 
    <span class="m-2 text-xl font-bold">Your Account</span>
    <div class="m-2 flex flex-col gap-2">
        <div class="flex flex-row items-center gap-2">
            <div><b>Username</b></div>
            <div>{{ client.user.getKeyedObject(client.userId)?.username }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(client.user.getKeyedObject(client.userId), ['username'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <div><b>Mail</b></div>
            <div>{{ client.user.getKeyedObject(client.userId)?.mail }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(client.user.getKeyedObject(client.userId), ['mail'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <div><b>Password</b></div>
            <div>{{ '************' }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(client.user.getKeyedObject(client.userId), ['password'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <Button type="button" label="Delete" icon="pi pi-trash" severity="danger" @click="deleteDialog?.handleDelete(client.user.getKeyedObject(client.userId))"></Button>
        </div>
    </div>
</template>