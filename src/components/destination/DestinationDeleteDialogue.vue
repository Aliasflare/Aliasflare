<script setup lang="ts">
import { ref } from 'vue';

let show = defineModel<boolean>('show', { required: true });
let destination = defineModel<any>('destination', { required: true });

const state = ref<"READY"|"LOADING"|"ERROR">("READY");
const error = ref<any>("Oh no");

async function performDelete() {
    state.value = "LOADING";
    const res = await fetch("/api/destination/delete", {
        method: "POST",
        body: JSON.stringify({
            destination: destination.value.id
        })
    });
    if(res.status != 200) {
        error.value = await res.text();
        state.value = "ERROR";
        return;
    }
    error.value = null;
    state.value = "READY";
    destination.value = null;
    show.value = false;
}

</script>

<template>
    <dialog class="modal modal-open">
        <div class="modal-box relative">
            <div class="LoadBlocker absolute left-0 top-0 w-full h-full z-50 bg-base-content/5 backdrop-blur-xs flex flex-row items-center justify-center" v-if="state == 'LOADING'">
                <span class="loading loading-circle loading-lg"></span>
            </div>
            <div class="ErrorBlocker absolute left-0 top-0 w-full h-full z-50 bg-error/50 backdrop-blur-xs flex flex-row items-center justify-center" v-if="state == 'ERROR'">
                <div>{{ error }}</div>
            </div>
            <h3 class="text-lg font-bold">Delete Destination?</h3>
            <p class="mt-4">Are you sure you want to delete this destination (<a class="text-info">{{ destination.mailBox + "@" + destination.mailDomain }}</a>)?</p>
            <p class="text-warning text-sm mt-2">All Aliases using this destination will be disabled!</p>
            <p class="text-error text-sm">Verification is lost and needs to be redone when recreated!</p>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn btn-error mr-2" @click="performDelete" :disabled="state != 'READY'">YES, DELETE IT!</button>
                    <button class="btn btn-success" @click="show = state == 'LOADING'" :disabled="state != 'READY'">Close</button>
                </form>
            </div>
        </div>
        <label class="modal-backdrop" @click="show = state == 'LOADING'">Close</label>
    </dialog>
</template>