<script setup lang="ts">
let value = defineModel<boolean|undefined>({ required: true });
const props = defineProps<{
    text: string,
    disabled?: boolean
}>();
</script>

<template>
    <div class="CheckboxInput flex flex-row my-2">
        <input type="checkbox" checked="true" class="checkbox checkbox-sm checkbox-primary" v-model="value" :disabled="props.disabled" />
        <div class="text-sm font-semibold ml-2">{{ props.text }}</div>
    </div>
</template>