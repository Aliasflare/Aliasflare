<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { AppState } from '@/AppState';
import UserModifyDialog from '@/componentsV2/UserModifyDialog.vue';

const modifyDialog = useTemplateRef('modifyDialog');
</script>

<template>
    <UserModifyDialog ref="modifyDialog" /> 
    <div class="text-2xl m-2">Your Account</div>
    <div class="m-2 flex flex-col gap-2">
        <div class="flex flex-row items-center gap-2">
            <div class="font-bold">Username</div>
            <div>{{ AppState.currentUser.username }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(AppState.currentUser, ['username'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <div class="font-bold">Mail</div>
            <div>{{ AppState.currentUser.mail }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(AppState.currentUser, ['mail'])" />
        </div>

        <div class="flex flex-row items-center gap-2">
            <div class="font-bold">Password</div>
            <div>{{ '************' }}</div>
            <Button icon="pi pi-pen-to-square" severity="secondary" size="small" aria-label="Save" @click="modifyDialog?.handleUpdate(AppState.currentUser, ['password'])" />
        </div>        
    </div>
</template>