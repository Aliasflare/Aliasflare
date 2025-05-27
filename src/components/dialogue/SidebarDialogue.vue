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
    <Teleport to="body">
        <div class="SidebarDialogueWrapper absolute w-full h-full top-0 left-0 z-10 bg-base-content/20" @click.self="show = state == 'LOADING'">
            <div class="SidebarDialogue absolute right-0 top-0 h-full w-full sm:w-[32rem] bg-base-100 sm:rounded-l-xl overflow-auto">
                <div class="LoadBlocker absolute left-0 top-0 w-full h-full z-50 bg-base-content/5 backdrop-blur-xs flex flex-col items-center justify-center" v-if="state == 'LOADING'">
                    <span class="loading loading-circle loading-lg"></span>
                </div>
                <div class="ErrorBlocker absolute left-0 top-0 w-full h-full z-50 bg-error/50 backdrop-blur-xs flex flex-col items-center justify-center" v-if="state == 'ERROR'">
                    <div>{{ error }}</div>
                    <button class="btn btn-error" @click="show = false">Close</button>
                </div>
                <div class="flex flex-col w-full h-full overflow-auto p-4">
                    <div class="text-2xl mb-2">{{ title }}</div>
                    <slot></slot>
                    <div class="flex-grow"></div>
                    <div class="flex flex-row py-2">
                        <button class="btn btn-success mr-2" @click="doConfirm" :disabled="state == 'LOADING'">{{ confirmText }}</button>
                        <button class="btn btn-error" @click="show = state == 'LOADING'" :disabled="state == 'LOADING'">Close</button>
                    </div>
                </div>
                
            </div>
        </div>
    </Teleport>
</template>