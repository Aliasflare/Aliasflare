<script setup lang="ts">
let value = defineModel<string|undefined>({ required: true });
const props = defineProps<{
    title: string,
    description: string,
    disabled: boolean
}>();
</script>

<template>
    <div class="flex flex-col my-2">
        <div class="text-sm font-semibold mb-2">{{ props.title }}</div>
        <div class="flex flex-row">
            <input type="color" class="h-full rounded-l" v-model="value" :disabled="props.disabled">
            <input type="text" class="input flex-grow" placeholder="#000000" v-model="value" :disabled="props.disabled" />
        </div>
        <div class="text-xs text-base-content/50 mt-1" v-if="description">{{ props.description }}</div>
    </div>
</template>