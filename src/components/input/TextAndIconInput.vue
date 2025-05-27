<script setup lang="ts">
import IconPicker from '@/components/icons/IconPicker.vue';

let textValue = defineModel<string|undefined>('text', { required: true });
let iconValue = defineModel<string|undefined>('icon', { required: true });
const props = defineProps<{
    title: string,
    description: string,
    disabled: boolean
}>();
</script>

<template>
    <div class="TextAndIconInput flex flex-col my-2">
        <div class="text-sm font-semibold mb-2">{{ props.title }}</div>
        <div class="flex flex-row">
            <IconPicker v-model="iconValue" :disabled="props.disabled"></IconPicker>
            <input type="text" class="input flex-grow" placeholder="Aliasflare - Private" v-model="textValue" :disabled="props.disabled" />
        </div>
        <div class="text-xs text-base-content/50 mt-1">{{ props.description }}</div>
    </div>
</template>