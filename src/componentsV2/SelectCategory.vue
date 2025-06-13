<script setup lang="ts">
import { categoryStore } from '@/api/CategoryStore';
import Display from './Display.vue';
</script>

<template>
    <Select :options="[{ id: '' }, ...categoryStore.getKeyedObjects()]" optionLabel="displayName" optionValue="id" placeholder="Category" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <Display :object="categoryStore.getKeyedObject(slotProps.value)" />
        </template>

        <template #option="slotProps">
            <Display :object="slotProps.option" />
        </template>
    </Select>
</template>