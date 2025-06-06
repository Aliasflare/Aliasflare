<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import SidebarDialogue from '@/components/dialogue/SidebarDialogue.vue';
import CheckboxInput from '@/components/input/CheckboxInput.vue';
import ColorInput from '@/components/input/ColorInput.vue';
import TextAndIconInput from '@/components/input/TextAndIconInput.vue';
import MailWithDomainInput from '@/components/input/MailWithDomainInput.vue';
import TextInput from '@/components/input/TextInput.vue';
import { AppState } from '@/AppState';
import InputSection from '../input/InputSection.vue';
import { aliasStore } from '@/api/AliasStore';
import SelectInput from '../input/SelectInput.vue';
import { destinationStore } from '@/api/DestinationStore';

let show = defineModel<boolean>('show', { required: true });
let { updateAliasId } = defineProps<{ updateAliasId?: any }>();

const alias = ref<any>({});

//Fetch existing data if present
async function preload() {
    alias.value = {};
    await destinationStore.list(AppState.currentUser.id, 0, 50);
    if(updateAliasId) Object.assign(alias.value, aliasStore.getKeyedObject(updateAliasId)); //Copy props from alias to update
}

async function handleCreateOrUpdate() {
    if(updateAliasId) {
        Object.assign(alias.value, await aliasStore.update(updateAliasId, alias.value));
        show.value = false;
    } else {
        Object.assign(alias.value, await aliasStore.create(AppState.currentUser.id, alias.value));
        show.value = false;
    }
}
</script>

<template>
    <SidebarDialogue v-model:show="show" :title="(updateAliasId ? 'Update' : 'Create') + ' Alias'" :confirmText="updateAliasId ? 'Update' : 'Create'" :preload="preload" :confirmAction="handleCreateOrUpdate">
        <InputSection title="Alias">
            <TextInput
                title="Token"
                description="This is the name / token of the alias"
                v-model="alias.token"
                :disabled="true"
                v-if="updateAliasId"
            ></TextInput>

            <!-- TODO: Fetch domains from server! -->
            <SelectInput
                title="Domain"
                description="Domain for this alias"
                :entries="[{key: 'tononym.de', title: 'tononym.de'}]"
                v-model="alias.domain"
                :disabled="updateAliasId != null"
            ></SelectInput>

            <SelectInput
                title="Destination"
                description="Mails will be delivered to this destination"
                :entries="[{key: undefined, title: '(Unassigned)'}, ...destinationStore.getKeyedObjects().map(a => ({ title: a.displayName, key: a.id }))]"
                v-model="alias.destinationID"
            ></SelectInput>
            <!-- Token -->
            <!-- Domain -->
        </InputSection>

        <InputSection title="Naming">
            <div class="alert alert-warning !p-2 !flex-none"><div>All of the naming settings <b>only apply to mail headers</b> and not the mail content!</div></div>
            <TextInput
                title="Sender Name on Icoming"
                description="This is an replacement for the name for the original sender name on mails you recieve"
                v-model="alias.remoteNameOverwriteOnIncoming"
            ></TextInput>
            <TextInput
                title="Sender Name on Outgoing"
                description="This is an replacement for the name for the original sender name on mails you send (keep empty to address them using their provided name)"
                v-model="alias.remoteNameOverwriteOnOutgoing"
            ></TextInput>
            <TextInput
                title="Own Name on Outgoing"
                description="This is an replacement for your name on mails you send"
                v-model="alias.ownNameOverwriteOnOutgoing"
            ></TextInput>
        </InputSection>
        
        <InputSection title="Display">
            <TextAndIconInput
                title="Name & Icon"
                description="This is the name and icon shown in the Webinterface for the destination"
                v-model:text="alias.displayName"
                v-model:icon="alias.displayIcon"
            ></TextAndIconInput>
            <ColorInput
                title="Color"
                description="This is the color shown in the Webinterface for the destination"
                v-model="alias.displayColor"
            ></ColorInput>
        </InputSection>        
        
        <InputSection title="Settings">
            <CheckboxInput text="Enabled" v-model="alias.enabled"></CheckboxInput>
        </InputSection>
    </SidebarDialogue>
</template>