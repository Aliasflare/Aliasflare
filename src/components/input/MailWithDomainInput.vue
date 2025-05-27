<script setup lang="ts">
let nameValue = defineModel<string|undefined>('name', { required: true });
let domainValue = defineModel<string|undefined>('domain', { required: true });
const props = defineProps<{
    title: string,
    description: string,
    disabled?: boolean
}>();
</script>

<template>
    <div class="MailWithDomainInput flex flex-col my-2">
        <div class="text-sm font-semibold mb-2">{{ props.title }}</div>
        <div class="flex flex-row">
            <input type="text" class="input flex-grow" placeholder="example" v-model="nameValue" :disabled="props.disabled" />
            <button class="btn btn-neutral" :disabled="true">@</button>
            <input type="text" class="input flex-grow" placeholder="example.com" v-model="domainValue" :disabled="props.disabled" />
        </div>
        <div class="text-xs text-base-content/50 mt-1">{{ props.description }}</div>
    </div>
</template>

