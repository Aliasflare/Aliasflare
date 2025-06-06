<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserWrapper from './UserWrapper.vue';
import { AppState } from '@/AppState';
import { aliasStore } from '@/api/AliasStore';
import AliasCard from '@/components/alias/AliasCard.vue';
import AliasManageDialogue from '@/components/alias/AliasManageDialogue.vue';

const pageState = ref<"READY"|"LOADING"|"ERROR">("LOADING");
const pageData = ref<any>();
const pageError = ref<any>();

const showCreationModal = ref<any>(false);
const showCreationModalRenew = Math.random();

async function load() {
    pageState.value = "LOADING";
    try {
        pageData.value = await aliasStore.list(AppState.currentUser.id, 0, 50);
        pageError.value = null;
        pageState.value = "READY";
    } catch(err) {
        pageData.value = null;
        pageError.value = err;
        pageState.value = "ERROR";
    }
}
onMounted(load);
</script>

<template>
    <UserWrapper>
        <div class="flex flex-col w-full relative">
            <div class="flex flex-row items-center m-2">
                <div class="text-2xl">Your Aliases</div>
                <span class="ml-4 loading loading-circle loading-sm" v-if="pageState == 'LOADING'"></span>
                <div class="flex-grow"></div>
                <button class="btn btn-secondary btn-sm" @click="showCreationModal = true; showCreationModalRenew = Math.random();">+ Add Alias</button>
            </div>
            <div class="AliasGrid mt-6 flex flex-row flex-wrap justify-center" v-if="pageData">
                <AliasCard v-for="alias of aliasStore.getKeyedObjects()" :aliasId="alias.id"></AliasCard>
            </div>
            <AliasManageDialogue v-if="showCreationModal" v-model:show="showCreationModal"></AliasManageDialogue>
        </div>
    </UserWrapper>
</template>