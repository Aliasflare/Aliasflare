<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import SidebarDialogue from '@/components/dialogue/SidebarDialogue.vue';
import CheckboxInput from '@/components/input/CheckboxInput.vue';
import ColorInput from '@/components/input/ColorInput.vue';
import TextAndIconInput from '@/components/input/TextAndIconInput.vue';
import MailWithDomainInput from '@/components/input/MailWithDomainInput.vue';
import TextInput from '@/components/input/TextInput.vue';
import { AppState } from '@/AppState';
import { destinationStore } from '@/api/DestinationStore';
import InputSection from '../input/InputSection.vue';

let show = defineModel<boolean>('show', { required: true });
let { updateDestinationId } = defineProps<{ updateDestinationId?: any }>();

const destination = ref<any>({});

//Fetch existing data if present
onBeforeMount(async() => {
    destination.value = {};
    if(updateDestinationId) Object.assign(destination.value, destinationStore.getKeyedObject(updateDestinationId)); //Copy props from destination to update
});

async function handleCreateOrUpdate() {
    if(updateDestinationId) {
        Object.assign(destination.value, await destinationStore.update(updateDestinationId, destination.value));
        show.value = false;
    } else {
        Object.assign(destination.value, await destinationStore.create(AppState.currentUser.id, destination.value));
        show.value = false;
    }
}
</script>

<template>
    <SidebarDialogue v-model:show="show" :title="(updateDestinationId ? 'Update' : 'Create') + ' Destination'" :confirmText="updateDestinationId ? 'Update' : 'Create'" :confirmAction="handleCreateOrUpdate">
        <InputSection title="Target">
            <TextInput
                title="Target Name"
                description="This is the recipient name shown on incoming mails (leave empty to use original senders name for you)"
                v-model="destination.mailName"
                ></TextInput>
            <MailWithDomainInput
                title="Target Mail (required)"
                description="This is the mail address incoming mails are delivered to! You'll need to confirm this mail later, do NOT use other peoples mails!"
                v-model:name="destination.mailBox"
                v-model:domain="destination.mailDomain"    
            ></MailWithDomainInput>
        </InputSection>
        
        <InputSection title="Display">
            <TextAndIconInput
                title="Name & Icon"
                description="This is the name and icon shown in the Webinterface for the destination"
                v-model:text="destination.displayName"
                v-model:icon="destination.displayIcon"
            ></TextAndIconInput>
            <ColorInput
                title="Color"
                description="This is the color shown in the Webinterface for the destination"
                v-model="destination.displayColor"
            ></ColorInput>
        </InputSection>        
        
        <InputSection title="Settings">
            <CheckboxInput text="Enabled" v-model="destination.enabled"></CheckboxInput>
        </InputSection>
    </SidebarDialogue>
</template>