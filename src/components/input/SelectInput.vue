<script setup lang="ts">
let value = defineModel<string|undefined>({ required: true });
const props = defineProps<{
    title: string,
    description: string,
    disabled?: boolean,
    entries: { title: string, key: string }[]
}>();
</script>

<template>
    <div class="SelectInput flex flex-col my-2" :data-value="value">
        <div class="text-sm font-semibold mb-2">{{ props.title }}</div>
        <div class="flex flex-row">
            <select class="select w-full" v-model="value" :disabled="disabled">
                <option disabled selected>Pick</option>
                <option v-for="entry in entries" :value="entry.key">{{ entry.title }}</option>
            </select>
        </div>
        <div class="text-xs text-base-content/50 mt-1">{{ props.description }}</div>
    </div>
</template>