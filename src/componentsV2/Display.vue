<script setup lang="ts">
import { getReadableTextColor } from '@/Utils';

const { object } = defineProps<{
    object?: any,
}>();
</script>

<template>
    <div class="flex items-center px-2 py-0.5 rounded-xl w-fit" :style="`background-color: #${object?.displayColor||'000000'}; color: ${getReadableTextColor(object?.displayColor||'000000')}`">
        <i :class="`pi pi-${object?.displayIcon||'question'} mr-2`"></i>
        <div>{{ object?.id ? (object?.displayName||'(Unnamed)')  : "(Unassigned)" }}</div>
    </div>
</template>