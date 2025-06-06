<script setup lang="ts">
import { aliasStore } from '@/api/AliasStore';
import ConfirmDialogue from '@/components/dialogue/ConfirmDialogue.vue';

let show = defineModel<boolean>('show', { required: true });
let { aliasId } = defineProps<{ aliasId: string }>();
</script>

<template>
    <ConfirmDialogue v-model:show="show" title="Delete Alias?" confirmText="YES, DELETE IT FOREVER!" :confirmAction="() => aliasStore.delete(aliasId)">
        <p class="mt-4">Are you sure you want to delete this alias (<a class="text-info">{{ aliasStore.getKeyedObject(aliasId)?.token + "@" + aliasStore.getKeyedObject(aliasId)?.domain }}</a>)?</p>
        <p class="text-warning text-sm mt-2">All incoming and outgoing mails will be rejected!</p>
        <p class="text-error text-sm">YOU WILL NEVER BE ABLE TO RECOVER THIS SAME ALIAS!</p>
    </ConfirmDialogue>
</template>