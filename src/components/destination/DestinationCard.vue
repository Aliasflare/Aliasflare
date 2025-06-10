<script setup lang="ts">
import { ref } from 'vue';
import MaterialSymbolsCheckCircleOutlineRounded from '~icons/material-symbols/check-circle-outline-rounded';
import MaterialSymbolsWarningOutline from '~icons/material-symbols/warning-outline';
import MaterialSymbolsInkPen from '~icons/material-symbols/ink-pen';
import MaterialSymbolsDelete from '~icons/material-symbols/delete';
import IconPicked from '../icons/IconPicked.vue';
import DestinationManageDialogue from './DestinationManageDialogue.vue';
import DestinationDeleteDialogue from './DestinationDeleteDialogue.vue';
import { destinationStore } from '@/api/DestinationStore';

let { destinationId } = defineProps<{ destinationId: string }>();
const showEditModal = ref<boolean>(false);
const showDeleteDialogue = ref<boolean>(false);
</script>

<template>
    <!--
    <div class="DestinationCard p-4 m-2 bg-base-300 text-base-300-content w-fit rounded-xl" :style="`border-top: 4px solid ${destinationStore.getKeyedObject(destinationId)?.displayColor||'black'};`">
        <div class="Header flex flex-row items-center">
            <IconPicked :icon="destinationStore.getKeyedObject(destinationId)?.displayIcon" class="mr-1"></IconPicked>
            <div class="font-semibold">{{ destinationStore.getKeyedObject(destinationId)?.displayName || 'Unnamed' }}</div>
        </div>
        <div>to <a class="text-info">{{ destinationStore.getKeyedObject(destinationId)?.mailBox + "@" + destinationStore.getKeyedObject(destinationId)?.mailDomain }}</a></div>
        <div class="EnabledBadge flex flex-row items-center text-sm text-success" v-if="destinationStore.getKeyedObject(destinationId)?.verfied == 1">
            <MaterialSymbolsCheckCircleOutlineRounded class="mr-1"></MaterialSymbolsCheckCircleOutlineRounded>
            <div>Verfied</div>
        </div>
        <div class="DisabledBadge flex flex-row items-center text-sm text-warning" v-if="destinationStore.getKeyedObject(destinationId)?.verified == 0">
            <MaterialSymbolsWarningOutline class="mr-1"></MaterialSymbolsWarningOutline>
            <div>Verification pending (check mail)</div>
        </div>
        <div class="Actions flex flex-row justify-end mt-3">
            <button class="btn btn-xs btn-success mr-2" @click="showEditModal = true"><MaterialSymbolsInkPen></MaterialSymbolsInkPen></button>
            <button class="btn btn-xs btn-error" @click="showDeleteDialogue = true"><MaterialSymbolsDelete></MaterialSymbolsDelete></button>
        </div>
        <DestinationManageDialogue v-if="showEditModal" v-model:show="showEditModal" :updateDestinationId="destinationId"></DestinationManageDialogue>
        <DestinationDeleteDialogue v-if="showDeleteDialogue" v-model:show="showDeleteDialogue" :destinationId="destinationId"></DestinationDeleteDialogue>
    </div>-->
    <v-card
        class="mx-auto"
        prepend-icon="$vuetify"
        width="400"
    >
        <v-card-title>
            <span class="font-weight-black">{{ destinationStore.getKeyedObject(destinationId)?.displayName || 'Unnamed' }}</span>
        </v-card-title>

        <v-card-subtitle>
            <span class="text-primary">{{ destinationStore.getKeyedObject(destinationId)?.mailBox + '@' + destinationStore.getKeyedObject(destinationId)?.mailDomain }}</span>
        </v-card-subtitle>

        <v-card-text>
            <div class="text-success" v-if="destinationStore.getKeyedObject(destinationId).verified"><v-icon icon="mdi-check"></v-icon> Verified</div>
            <div class="text-warning" v-else><v-icon icon="mdi-alert" ></v-icon> Verification is pending</div>
        </v-card-text>
    </v-card>
</template>