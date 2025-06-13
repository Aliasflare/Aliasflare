<script setup lang="ts">
import { destinationStore } from '@/api/DestinationStore';
</script>

<template>
    <Select :options="[{ id: '' }, ...destinationStore.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Destination" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <div class="flex items-center h-full w-full">
                <ColorPicker :modelValue="destinationStore.getKeyedObject(slotProps.value)?.displayColor||'000000'" v-if="destinationStore.getKeyedObject(slotProps.value)" class="pointer-events-none mr-2"></ColorPicker>
                <i :class="`pi pi-${destinationStore.getKeyedObject(slotProps.value)?.displayIcon||'question'} mr-2`"></i>
                <div>{{ destinationStore.getKeyedObject(slotProps.value)?.displayName || "(Unassigned)" }}</div>
            </div>
        </template>

        <template #option="slotProps">
            <div class="flex items-center">
                <ColorPicker :modelValue="slotProps.option.displayColor||'000000'" v-if="slotProps.option.id" class="pointer-events-none mr-2"></ColorPicker>
                <i :class="`pi pi-${slotProps.option.displayIcon||'question'} mr-2`"></i>
                <div>{{ slotProps.option.displayName || "(Unassigned)" }} </div>
            </div>
        </template>
    </Select>
</template>