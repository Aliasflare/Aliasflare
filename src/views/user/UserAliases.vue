<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserWrapper from './UserWrapper.vue';
import MaterialSymbolsEdit from '~icons/material-symbols/edit';

const pageState = ref<"READY"|"LOADING"|"ERROR">("LOADING");
const pageData = ref<any>();
const pageError = ref<any>();

async function loadAliases() {
    pageState.value = "LOADING";
    const res = await fetch("/api/alias/list", {
        method: "POST",
        body: JSON.stringify({
            own: true
        })
    });
    if(res.status != 200) {
        pageData.value = await res.json();;
        pageError.value = await res.json();
        pageState.value = "ERROR";
        return;
    }
    pageError.value = null;
    pageData.value = (await res.json()).aliases;
    pageState.value = "READY";
}
onMounted(loadAliases);

async function toggleEnabled(alias: any) {
    await fetch("/api/alias/update", {
        method: "POST",
        body: JSON.stringify({
            id: alias.id,
            enabled: !alias.enabled
        })
    });
    await loadAliases();
}

</script>

<template>
    <UserWrapper>
        <div class="flex flex-col w-full relative">
            <div class="flex flex-row m-2">
                <div class="text-2xl">Your Aliases</div>
                <span class="ml-4 loading loading-circle loading-sm" v-if="pageState == 'LOADING'"></span>
                <div class="flex-grow"></div>
                <button class="btn btn-info btn-sm">+ Create Alias</button>
            </div>
            <div class="AliasGrid flex flex-row flex-wrap" v-if="pageData">
                <div class="AliasCard p-4 m-2 bg-base-300 text-base-300-content w-fit rounded-xl" v-for="alias in pageData">
                    <div class="font-semibold">{{ alias.id + "@" + alias.domain }}</div>
                    <div>to <a class="text-info">{{ alias.destinationMail }}</a></div>
                    <div>last mail <a class="text-primary">{{ new Date(alias.lastMailAt).toLocaleString() }}</a></div>
                    <div class="mb-2"></div>
                    <div class="flex flex-row items-center">
                        <input type="checkbox" :checked="alias.enabled" class="toggle toggle-success right-0" @change="toggleEnabled(alias)" />
                        <div class="flex-grow"></div>
                        <button class="btn btn-sm btn-circle">
                            <MaterialSymbolsEdit></MaterialSymbolsEdit>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </UserWrapper>
</template>