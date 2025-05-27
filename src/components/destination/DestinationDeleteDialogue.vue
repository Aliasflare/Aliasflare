<script setup lang="ts">
import { destinationStore } from '@/api/DestinationStore';
import ConfirmDialogue from '@/components/dialogue/ConfirmDialogue.vue';

let show = defineModel<boolean>('show', { required: true });
let { destinationId } = defineProps<{ destinationId: string }>();
</script>

<template>
    <ConfirmDialogue v-model:show="show" title="Delete Destination?" confirmText="YES, DELETE IT!" :confirmAction="() => destinationStore.delete(destinationId)">
        <p class="mt-4">Are you sure you want to delete this destination (<a class="text-info">{{ destinationStore.getKeyedObject(destinationId)?.mailBox + "@" + destinationStore.getKeyedObject(destinationId)?.mailDomain }}</a>)?</p>
        <p class="text-warning text-sm mt-2">All Aliases using this destination will be disabled!</p>
        <p class="text-error text-sm">Verification is lost and needs to be redone when recreated!</p>
    </ConfirmDialogue>
</template>