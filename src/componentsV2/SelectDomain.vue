<script setup lang="ts">
import { AppState } from '@/AppState';
const domains = AppState.config?.domains || [];
</script>

<template>
    <Select :options="domains" placeholder="Domain" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center h-full w-full">
                <div>{{ slotProps.value }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>

        <template #option="slotProps">
            <div class="flex items-center">
                <div>{{ slotProps.option }}</div>
            </div>
        </template>
    </Select>
</template>
