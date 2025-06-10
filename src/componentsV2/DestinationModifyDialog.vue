<script setup lang="ts">
import { AppState } from '@/AppState';
import { destinationStore } from '@/api/DestinationStore';
import { ref } from 'vue';
import SelectIcon from './SelectIcon.vue';

const show = ref(false);
const target = ref<undefined|string>(undefined);
const fields = ref<any>({});

function handleUpdate(destination: any) {
    target.value = destination.id;
    fields.value = {};
    Object.assign(fields.value, destination);
    show.value = true;
}

function handleCreate() {
    target.value = undefined;
    fields.value = {};
    show.value = true;
}

defineExpose({
    handleUpdate,
    handleCreate
});

async function createOrUpdate() {
    if(target.value)
        await destinationStore.update(target.value, fields.value);
    else 
        await destinationStore.create(AppState.currentUser.id, fields.value);
    show.value = false;
}
</script>

<template>
    <!-- MODIFY DIAGLOUE -->
        <Dialog v-model:visible="show" modal :header="target ? 'Update Destination' : 'Create Destination'" class="w-96">
            <div class="flex flex-col gap-2 mb-8">
                <label>Display</label>
                <InputGroup>
                    <SelectIcon v-model="fields.displayIcon"></SelectIcon>
                    <InputGroupAddon>
                        <ColorPicker v-model="fields.displayColor"></ColorPicker>
                    </InputGroupAddon>
                    <InputText v-model="fields.displayName" placeholder="Primary" />
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls how this destination will shop up in the webinterface</Message>
            </div>

            <div class="flex flex-col gap-2 mb-8">
                <label>Mail Address</label>
                <InputGroup>
                    <InputText v-model="fields.mailBox" placeholder="mustermann" />
                    <InputGroupAddon>
                        <i class="pi pi-at"></i>
                    </InputGroupAddon>
                    <InputText v-model="fields.mailDomain" placeholder="mail.com" />
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls where mails should go when taking this destination</Message>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Discard" severity="secondary" @click="show = false"></Button>
                <Button type="button" :label="target ? 'Update' : 'Create'" @click="createOrUpdate()"></Button>
            </div>
        </Dialog>
</template>