<script setup lang="ts">
import { ref } from 'vue';
import MaterialSymbolsCheckCircleOutlineRounded from '~icons/material-symbols/check-circle-outline-rounded';
import MaterialSymbolsWarningOutline from '~icons/material-symbols/warning-outline';
import MaterialSymbolsInkPen from '~icons/material-symbols/ink-pen';
import MaterialSymbolsDelete from '~icons/material-symbols/delete';
import IconPicked from '../icons/IconPicked.vue';
import DestinationManageDialogue from './DestinationManageDialogue.vue';
import DestinationDeleteDialogue from './DestinationDeleteDialogue.vue';

let destination = defineModel<any>('destination', { required: true });
const showEditModal = ref<boolean>(false);
const showDeleteDialogue = ref<boolean>(false);
</script>

<template>
    <div class="DestinationCard p-4 m-2 bg-base-300 text-base-300-content w-fit rounded-xl" :style="`border-top: 4px solid ${destination.displayColor||'black'};`" v-if="destination">
        <div class="Header flex flex-row items-center">
            <IconPicked :icon="destination.displayIcon" class="mr-1"></IconPicked>
            <div class="font-semibold">{{ destination.displayName || 'Unnamed' }}</div>
        </div>
        <div>to <a class="text-info">{{ destination.mailBox + "@" + destination.mailDomain }}</a></div>
        <div class="EnabledBadge flex flex-row items-center text-sm text-success" v-if="destination.verfied == 1">
            <MaterialSymbolsCheckCircleOutlineRounded class="mr-1"></MaterialSymbolsCheckCircleOutlineRounded>
            <div>Verfied</div>
        </div>
        <div class="DisabledBadge flex flex-row items-center text-sm text-warning" v-if="destination.verified == 0">
            <MaterialSymbolsWarningOutline class="mr-1"></MaterialSymbolsWarningOutline>
            <div>Verification pending (check mail)</div>
        </div>
        <div class="Actions flex flex-row justify-end mt-3">
            <button class="btn btn-xs btn-success mr-2" @click="showEditModal = true"><MaterialSymbolsInkPen></MaterialSymbolsInkPen></button>
            <button class="btn btn-xs btn-error" @click="showDeleteDialogue = true"><MaterialSymbolsDelete></MaterialSymbolsDelete></button>
        </div>
        <DestinationManageDialogue v-if="showEditModal" v-model:show="showEditModal" v-model:destination="destination"></DestinationManageDialogue>
        <DestinationDeleteDialogue v-if="showDeleteDialogue" v-model:show="showDeleteDialogue" v-model:destination="destination"></DestinationDeleteDialogue>
    </div>
</template>