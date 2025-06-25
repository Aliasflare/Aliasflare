<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import Display from './Display.vue';
const { client } = defineProps<{ client: APIClientPerspective }>();
</script>

<template>
    <Select :options="[{ id: '' }, ...client.destination.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Destination" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <Display :object="client.destination.getKeyedObject(slotProps.value)" />
        </template>

        <template #option="slotProps">
            <Display :object="slotProps.option" />
        </template>
    </Select>
</template>