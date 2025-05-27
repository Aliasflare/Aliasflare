<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserWrapper from './UserWrapper.vue';
import DestinationManageDialogue from '@/components/destination/DestinationManageDialogue.vue';
import DestinationCard from '@/components/destination/DestinationCard.vue';
import { destinationStore } from '@/api/DestinationStore';
import { AppState } from '@/AppState';

const pageState = ref<"READY"|"LOADING"|"ERROR">("LOADING");
const pageData = ref<any>();
const pageError = ref<any>();

const showCreationModal = ref<any>(false);
const showCreationModalRenew = Math.random();

async function loadDestinations() {
    pageState.value = "LOADING";
    try {
        pageData.value = await destinationStore.list(AppState.currentUser.id, 0, 50);
        pageError.value = null;
        pageState.value = "READY";
    } catch(err) {
        pageData.value = null;
        pageError.value = err;
        pageState.value = "ERROR";
    }
}
onMounted(loadDestinations);
</script>

<template>
    <UserWrapper>
        <div class="flex flex-col w-full relative">
            <div class="flex flex-row items-center m-2">
                <div class="text-2xl">Your Destinations</div>
                <span class="ml-4 loading loading-circle loading-sm" v-if="pageState == 'LOADING'"></span>
                <div class="flex-grow"></div>
                <button class="btn btn-primary btn-sm" @click="showCreationModal = true; showCreationModalRenew = Math.random();">+ Add Destination</button>
            </div>
            <div class="DestinationGrid mt-6 flex flex-row flex-wrap justify-center" v-if="pageData">
                <DestinationCard v-for="destination of destinationStore.getKeyedObjects()" :destinationId="destination.id"></DestinationCard>
            </div>
            <DestinationManageDialogue v-if="showCreationModal" v-model:show="showCreationModal"></DestinationManageDialogue>
        </div>
    </UserWrapper>
</template>