<script setup lang="ts">
import { destinationStore } from '@/api/DestinationStore';
import Display from './Display.vue';
</script>

<template>
    <Select :options="[{ id: '' }, ...destinationStore.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Destination" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <Display :object="destinationStore.getKeyedObject(slotProps.value)" />
        </template>

        <template #option="slotProps">
            <Display :object="slotProps.option" />
        </template>
    </Select>
</template>