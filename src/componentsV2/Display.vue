<script setup lang="ts">
import { getReadableTextColor } from '@/Utils';

const { object } = defineProps<{
    object?: any,
    tag?: boolean
}>();
</script>

<template>
    <div class="flex items-center px-2 py-1 w-fit overflow-hidden" :class="{ 'rounded-xl': !tag }" :style="`background-color: #${object?.displayColor||'000000'}; color: ${getReadableTextColor(object?.displayColor||'000000')}`">
        <i :class="`pi pi-${object?.displayIcon||'question'} mr-2`" v-if="!object || object?.displayIcon"></i>
        <div class="w-6 h-6 mr-2 relative" v-if="object?.displayImage || object?.displayURL">
            <img :src="object?.displayImage||`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${object?.displayURL}&size=24`" class="w-full h-full rounded-full" />
        </div>
        <a :href="object?.displayURL" :class="{'hover:cursor-alias hover:underline': object?.displayURL}">{{ object?.id ? (object?.displayName||'(Unnamed)')  : "(Unassigned)" }}</a>
    </div>
</template>