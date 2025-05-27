<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { AppState } from '@/AppState';
import SidebarDialogue from '@/components/dialogue/SidebarDialogue.vue';
import CheckboxInput from '@/components/input/CheckboxInput.vue';
import ColorInput from '../input/ColorInput.vue';
import TextAndIconInput from '../input/TextAndIconInput.vue';
import { destinationStore } from '@/api/DestinationStore';

let show = defineModel<boolean>('show', { required: true });
let { updateDestinationId } = defineProps<{ updateDestinationId?: any }>();

const pageState = ref<"READY"|"LOADING"|"ERROR">("READY");
const pageError = ref<any>(null);
const destination = ref<any>({});

//Fetch existing data if present
onBeforeMount(async() => {
    pageState.value = "READY";
    pageError.value = null;
    destination.value = {};
    if(updateDestinationId) Object.assign(destination.value, destinationStore.getKeyedObject(updateDestinationId)); //Copy props from destination to update
});

async function handleCreateOrUpdate() {
    if(updateDestinationId) {
        pageState.value = "LOADING";
        Object.assign(destination.value, await destinationStore.update(updateDestinationId, destination.value));
        show.value = false;
    } else {
        pageState.value = "LOADING";
        Object.assign(destination.value, await destinationStore.create(AppState.currentUser.id, destination.value));
        show.value = false;
    }
}
</script>

<template>
    <SidebarDialogue v-model:show="show" :title="(updateDestinationId ? 'Update' : 'Create') + ' Destination'" :confirmText="updateDestinationId ? 'Update' : 'Create'" :confirmAction="handleCreateOrUpdate">
        <!-- Target -->
        <div class="text-lg font-semibold my-2">Target</div>
        <div class="flex flex-col my-2">
            <div class="text-sm font-semibold mb-2">Target Name</div>
            <div class="flex flex-row">
                <input type="text" class="input flex-grow" placeholder="Aliasflare OSS" v-model="destination.mailName" :disabled="pageState == 'LOADING'" />
            </div>
            <div class="text-xs text-base-content/50 mt-1">This is the recipient name shown on incoming mails (leave empty to use original senders name for you)</div>
        </div>
        <div class="flex flex-col my-2">
            <div class="text-sm font-semibold mb-2">Target Mail <a class="text-xs text-warning">(required)</a></div>
            <div class="flex flex-row">
                <input type="text" class="input flex-grow" placeholder="private" v-model="destination.mailBox" :disabled="pageState == 'LOADING'" />
                <button class="btn btn-neutral" :disabled="true">@</button>
                <input type="text" class="input flex-grow" placeholder="aliasflare.ts" v-model="destination.mailDomain" :disabled="pageState == 'LOADING'" />
            </div>
            <div class="text-xs text-base-content/50 mt-1">This is the mail address incoming mails are delivered to</div>
            <div class="text-xs text-error">You'll need to confirm this mail later, do NOT use other peoples mails!</div>
        </div>

        <!-- Display -->
        <div class="text-lg font-semibold my-2">Display</div>
        <TextAndIconInput
            title="Name & Icon"
            description="This is the name and icon shown in the Webinterface for the destination"
            v-model:text="destination.displayName"
            v-model:icon="destination.displayIcon"
            :disabled="pageState == 'LOADING'" 
        ></TextAndIconInput>
        <ColorInput
            title="Color"
            description="This is the color shown in the Webinterface for the destination"
            v-model="destination.displayColor"
            :disabled="pageState == 'LOADING'"
        ></ColorInput>

        <!-- Settings -->
        <div class="text-lg font-semibold my-2">Settings</div>
        <CheckboxInput text="Enabled" v-model="destination.enabled" :disabled="pageState == 'LOADING'"></CheckboxInput>
        <CheckboxInput text="Verified" v-model="destination.verified" :disabled="pageState == 'LOADING'"></CheckboxInput>
    </SidebarDialogue>
</template>