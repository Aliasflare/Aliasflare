<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import Display from './Display.vue';
const { client } = defineProps<{ client: APIClientPerspective }>();
</script>

<template>
    <Select :options="[{ id: '' }, ...client.category.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Category" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <Display :object="client.category.getKeyedObject(slotProps.value)" :tag="true" />
        </template>

        <template #option="slotProps">
            <Display :object="slotProps.option" :tag="true" />
        </template>
    </Select>
</template>