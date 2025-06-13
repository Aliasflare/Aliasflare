<script setup lang="ts">
import { ref } from 'vue';
import { AppState } from '@/AppState';
import { aliasStore } from '@/api/AliasStore';
import SelectIcon from './SelectIcon.vue';
import SelectDestination from './SelectDestination.vue';
import SelectDomain from './SelectDomain.vue';

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
        await aliasStore.update(target.value, fields.value);
    else 
        await aliasStore.create(AppState.currentUser.id, fields.value);
    show.value = false;
}
</script>

<template>
    <!-- MODIFY DIAGLOUE -->
        <Dialog v-model:visible="show" modal :header="target ? 'Update Alias' : 'Create Alias'" class="w-96">
            <div class="flex flex-col gap-2 mb-8">
                <label>Display</label>
                <InputGroup>
                    <SelectIcon v-model="fields.displayIcon"></SelectIcon>
                    <InputGroupAddon>
                        <ColorPicker defaultColor="000000" v-model="fields.displayColor"></ColorPicker>
                    </InputGroupAddon>
                    <InputText v-model="fields.displayName" placeholder="Primary" />
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls how this alias will shop up in the webinterface</Message>
            </div>

            <div class="flex flex-col gap-2 mb-8">
                <label>Alias</label>
                <InputGroup>
                    <InputText v-model="fields.token" placeholder="*Random*" :disabled="target != undefined" />
                    <InputGroupAddon>
                        <i class="pi pi-at"></i>
                    </InputGroupAddon>
                    <SelectDomain v-model="fields.domain" :disabled="target != undefined" />
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls on which domain and with which token you alias should be created</Message>
            </div>


            <div class="flex flex-col gap-2 mb-8">
                <label>Destination</label>
                <InputGroup>
                    <SelectDestination v-model="fields.destinationID"></SelectDestination>
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls where mails to this alias are delivered to</Message>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Discard" severity="secondary" @click="show = false"></Button>
                <Button type="button" :label="target ? 'Update' : 'Create'" @click="createOrUpdate()"></Button>
            </div>
        </Dialog>
</template>