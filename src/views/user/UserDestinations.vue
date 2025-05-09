<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { AppState } from '@/AppState'
import UserWrapper from './UserWrapper.vue';
import DestinationManageDialogue from '@/components/destination/DestinationManageDialogue.vue';
import DestinationCard from '@/components/destination/DestinationCard.vue';

const pageState = ref<"READY"|"LOADING"|"ERROR">("LOADING");
const pageData = ref<any>();
const pageError = ref<any>();

const showCreationModal = ref<any>(false);
const showCreationModalRenew = Math.random();

async function loadDestinations() {
    pageState.value = "LOADING";
    const res = await fetch("/api/destination/list", {
        method: "POST",
        body: JSON.stringify({
            user: AppState.currentUser.id,
            page: 0,
            limit: 50
        })
    });
    if(res.status != 200) {
        pageData.value = null;;
        pageError.value = await res.text();
        pageState.value = "ERROR";
        return;
    }
    pageError.value = null;
    pageData.value = (await res.json()).destinations;
    pageState.value = "READY";
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
                <DestinationCard v-for="destinationKey of Object.keys(pageData)" v-model:destination="pageData[destinationKey]"></DestinationCard>
            </div>
            <DestinationManageDialogue v-if="showCreationModal" v-model:show="showCreationModal" @created="a => pageData.push(a)"></DestinationManageDialogue>
        </div>
    </UserWrapper>
</template>