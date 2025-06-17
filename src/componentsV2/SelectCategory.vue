<script setup lang="ts">
import { Stores } from '@/api/Stores';
import Display from './Display.vue';
const { stores } = defineProps<{ stores: Stores }>();
</script>

<template>
    <Select :options="[{ id: '' }, ...stores.categoryStore.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Category" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <Display :object="stores.categoryStore.getKeyedObject(slotProps.value)" :tag="true" />
        </template>

        <template #option="slotProps">
            <Display :object="slotProps.option" :tag="true" />
        </template>
    </Select>
</template>