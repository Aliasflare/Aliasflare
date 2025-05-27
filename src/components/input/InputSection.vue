<script setup lang="ts">
const props = defineProps<{
    title: string,
}>();
</script>

<template>
    <div class="InputSection flex flex-col h-full">
        <div class="InputSectionTitle text-lg font-semibold my-2">{{ props.title }}</div>
        <slot></slot>
    </div>
</template>