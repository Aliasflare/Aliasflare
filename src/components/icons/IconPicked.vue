<script setup lang="ts">
import { IconMap } from './Icons';
const props = defineProps<{ icon?: string }>();
</script>

<template>
    <component :is="IconMap[props.icon||'MaterialSymbolsHome']"></component>
</template>