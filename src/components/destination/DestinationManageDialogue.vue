<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AppState } from '@/AppState';
import SidebarModal from '@/components/SidebarModal.vue';
import IconPicker from '@/components/icons/IconPicker.vue';
import { diff, transformBooleans } from '@/Utils';

let show = defineModel<boolean>('show', { required: true });
let updateDestination = defineModel<any>('destination', { required: false });
const emits = defineEmits<{ created: [ value: any ]}>();

const pageState = ref<"READY"|"LOADING"|"ERROR">("READY");
const pageError = ref<any>(null);
const destination = ref<null|any>({});

//Fetch existing data if present
onMounted(async() => {
    pageState.value = "READY";
    pageError.value = null;
    destination.value = {};
    if(updateDestination.value)
        Object.assign(destination.value, updateDestination.value);
});

async function handleCreateOrUpdate() {
    if(updateDestination.value) {
        pageState.value = "LOADING";
        const res = await fetch("/api/destination/update", {
            method: "POST",
            body: JSON.stringify({
                destination: updateDestination.value.id,
                ...diff(updateDestination.value, destination.value),
            }),
        });        
        if(res.status != 200) {
            pageError.value = await res.text();
            pageState.value = "ERROR";
            return;
        }
        pageError.value = null;
        pageState.value = "READY";
        updateDestination.value = (await res.json()).destination;
        show.value = false;
    } else {
        pageState.value = "LOADING";
        const res = await fetch("/api/destination/create", {
            method: "POST",
            body: JSON.stringify({
                user: AppState.currentUser.id,
                ...destination.value
            }),
        });        
        if(res.status != 200) {
            pageError.value = await res.text();
            pageState.value = "ERROR";
            return;
        }
        pageError.value = null;
        pageState.value = "READY";
        emits('created', (await res.json()).destination);
        show.value = false;
    }
}
</script>

<template>
    <SidebarModal @backdrop-clicked="show = pageState == 'LOADING'">
        <div class="LoadBlocker absolute left-0 top-0 w-full h-full z-50 bg-base-content/5 backdrop-blur-xs flex flex-col items-center justify-center" v-if="pageState == 'LOADING'">
            <span class="loading loading-circle loading-lg"></span>
        </div>
        <div class="ErrorBlocker absolute left-0 top-0 w-full h-full z-50 bg-error/50 backdrop-blur-xs flex flex-col items-center justify-center" v-if="pageState == 'ERROR'">
            <div>{{ pageError }}</div>
            <button class="btn btn-error" @click="show = false">Close</button>
        </div>
        <div class="flex flex-col w-full h-full overflow-auto p-4">
            <!-- Title -->
            <div class="text-2xl mb-2">{{ updateDestination ? 'Update' : 'Create' }} Destination</div>

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
            <div class="flex flex-col my-2">
                <div class="text-sm font-semibold mb-2">Name & Icon</div>
                <div class="flex flex-row">
                    <IconPicker v-model="destination.displayIcon" :disabled="pageState == 'LOADING'"></IconPicker>
                    <input type="text" class="input flex-grow" placeholder="Aliasflare - Private" v-model="destination.displayName" :disabled="pageState == 'LOADING'" />
                </div>
                <div class="text-xs text-base-content/50 mt-1">This is the name shown in the Webinterface for the destination</div>
            </div>
            <div class="flex flex-col my-2">
                <div class="text-sm font-semibold mb-2">Color</div>
                <div class="flex flex-row">
                    <input type="color" class="h-full rounded-l" v-model="destination.displayColor" :disabled="pageState == 'LOADING'">
                    <input type="text" class="input flex-grow" placeholder="#000000" v-model="destination.displayColor" :disabled="pageState == 'LOADING'" />
                </div>
                <div class="text-xs text-base-content/50 mt-1">This is the color shown in the Webinterface for the destination</div>
            </div>

            <!-- Settings -->
            <div class="text-lg font-semibold my-2">Settings</div>
            <div class="flex flex-row my-2">
                <input type="checkbox" checked="true" class="checkbox checkbox-sm checkbox-primary" v-model="destination.enabled" :disabled="pageState == 'LOADING'" />
                <div class="text-sm font-semibold ml-2">Enabled</div>
            </div>
            <div class="flex flex-row my-2">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-warning" v-model="destination.verified" :disabled="pageState == 'LOADING'" />
                <div class="text-sm font-semibold ml-2">Verified</div>
            </div>

            <!-- Buttons -->
            <div class="flex-grow"></div>
            <div class="flex flex-row py-2">
                <button class="btn btn-success mr-2" @click="handleCreateOrUpdate" :disabled="pageState == 'LOADING'">{{ updateDestination ? 'Update' : 'Create' }}</button>
                <button class="btn btn-error" @click="show = pageState == 'LOADING'" :disabled="pageState == 'LOADING'">Close</button>
            </div>
        </div>
    </SidebarModal>
</template>