<script setup lang="ts">
import { ref } from 'vue';
import MaterialSymbolsCheckCircleOutlineRounded from '~icons/material-symbols/check-circle-outline-rounded';
import MaterialSymbolsWarningOutline from '~icons/material-symbols/warning-outline';
import MaterialSymbolsInkPen from '~icons/material-symbols/ink-pen';
import MaterialSymbolsDelete from '~icons/material-symbols/delete';
import IconPicked from '../icons/IconPicked.vue';
import { aliasStore } from '@/api/AliasStore';

let { aliasId } = defineProps<{ aliasId: string }>();
const showEditModal = ref<boolean>(false);
const showDeleteDialogue = ref<boolean>(false);
</script>

<template>
    <div class="AliasCard p-4 m-2 bg-base-300 text-base-300-content w-fit rounded-xl" :style="`border-top: 4px solid ${aliasStore.getKeyedObject(aliasId)?.displayColor||'black'};`">
        <div class="Header flex flex-row items-center">
            <IconPicked :icon="aliasStore.getKeyedObject(aliasId)?.displayIcon" class="mr-1"></IconPicked>
            <div class="font-semibold">{{ aliasStore.getKeyedObject(aliasId)?.displayName || 'Unnamed' }}</div>
        </div>
        <div>to <a class="text-info">{{ aliasStore.getKeyedObject(aliasId)?.mailBox + "@" + aliasStore.getKeyedObject(aliasId)?.mailDomain }}</a></div>
        <div class="EnabledBadge flex flex-row items-center text-sm text-success" v-if="aliasStore.getKeyedObject(aliasId)?.verfied == 1">
            <MaterialSymbolsCheckCircleOutlineRounded class="mr-1"></MaterialSymbolsCheckCircleOutlineRounded>
            <div>Verfied</div>
        </div>
        <div class="DisabledBadge flex flex-row items-center text-sm text-warning" v-if="aliasStore.getKeyedObject(aliasId)?.verified == 0">
            <MaterialSymbolsWarningOutline class="mr-1"></MaterialSymbolsWarningOutline>
            <div>Verification pending (check mail)</div>
        </div>
        <div class="Actions flex flex-row justify-end mt-3">
            <button class="btn btn-xs btn-success mr-2" @click="showEditModal = true"><MaterialSymbolsInkPen></MaterialSymbolsInkPen></button>
            <button class="btn btn-xs btn-error" @click="showDeleteDialogue = true"><MaterialSymbolsDelete></MaterialSymbolsDelete></button>
        </div>
    </div>
</template>