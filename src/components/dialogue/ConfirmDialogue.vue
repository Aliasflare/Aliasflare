<script setup lang="ts">
import { ref } from 'vue';

let show = defineModel<boolean>('show', { required: true });
const props = defineProps<{
    confirmText: string,
    confirmAction: () => Promise<void>,
    title: string,
}>();
const emits = defineEmits<{
    confirmed: [value: undefined]
}>();

const state = ref<"READY"|"LOADING"|"ERROR">("READY");
const error = ref<any>("Oh no");

async function doConfirm() {
    state.value = "LOADING";
    try {
        await props.confirmAction();
        error.value = null;
        state.value = "READY";
        emits("confirmed", undefined);
        show.value = false;
    } catch(err) {
        error.value = err;
        state.value = "ERROR";
    }
}

</script>

<template>
    <dialog class="ConfirmDialogue modal modal-open">
        <div class="modal-box relative">
            <div class="LoadBlocker absolute left-0 top-0 w-full h-full z-50 bg-base-content/5 backdrop-blur-xs flex flex-col items-center justify-center" v-if="state == 'LOADING'">
                <span class="loading loading-circle loading-lg"></span>
            </div>
            <div class="ErrorBlocker absolute left-0 top-0 w-full h-full z-50 bg-error/50 backdrop-blur-xs flex flex-col items-center justify-center" v-if="state == 'ERROR'">
                <div>{{ error }}</div>
                <button class="btn btn-error" @click="show = false">Close</button>
            </div>
            <h3 class="text-lg font-bold">{{ title }}</h3>
            <div class="Content">
                <slot></slot>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn btn-error mr-2" @click="doConfirm" :disabled="state != 'READY'">{{ confirmText }}</button>
                    <button class="btn btn-success" @click="show = state == 'LOADING'" :disabled="state != 'READY'">Close</button>
                </form>
            </div>
        </div>
        <label class="modal-backdrop" @click="show = state == 'LOADING'">Close</label>
    </dialog>
</template>