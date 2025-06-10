<script setup lang="ts">
const icons = [
    { name: '(None)', code: undefined },
    { name: 'Dollar', code: 'dollar' },
    { name: 'At', code: 'at' },
];
</script>

<template>
    <Select :options="icons" optionLabel="name" optionValue="code" placeholder="Icon" checkmark :highlightOnSelect="false" class="w-16">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center h-full w-full">
                <i :class="`pi pi-${slotProps.value} mr-2`"></i>
                <div>{{ icons.find(a => a.code == slotProps.value)?.name }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>

        <template #option="slotProps">
            <div class="flex items-center">
                <i :class="`pi pi-${slotProps.option.code} mr-2`"></i>
                <div>{{ slotProps.option.name }}</div>
            </div>
        </template>
    </Select>
</template>
