<script setup lang="ts">
import { Stores } from '@/api/Stores';
import Display from './Display.vue';
const { stores } = defineProps<{ stores: Stores }>();
</script>

<template>
    <Select :options="[{ id: '' }, ...stores.destinationStore.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Destination" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <Display :object="stores.destinationStore.getKeyedObject(slotProps.value)" />
        </template>

        <template #option="slotProps">
            <Display :object="slotProps.option" />
        </template>
    </Select>
</template>