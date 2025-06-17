<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import { ref } from 'vue';
import SelectIcon from './SelectIcon.vue';
import SelectCategory from './SelectCategory.vue';

const { stores } = defineProps<{ stores: Stores }>();

const showFields = ref<undefined|string[]>();
function renderField(field: string) { return !showFields.value || showFields?.value?.includes('*') || showFields?.value?.includes(field); }

const show = ref(false);
const target = ref<undefined|string>(undefined);
const fields = ref<any>({});

function handleUpdate(destination: any, pShowFields?: string[]) {
    target.value = destination.id;
    fields.value = {};
    Object.assign(fields.value, destination);
    show.value = true;
    showFields.value = pShowFields;
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
        await stores.destinationStore.update(target.value, fields.value);
    else 
        await stores.destinationStore.create(stores.perspective, fields.value);
    show.value = false;
}
</script>

<template>
    <!-- MODIFY DIAGLOUE -->
        <Dialog v-model:visible="show" modal :header="target ? 'Update Destination' : 'Create Destination'" class="w-96">
            <div class="flex flex-col gap-2 mb-8" v-if="renderField('display')">
                <label>Display</label>
                <InputGroup>
                    <SelectIcon v-model="fields.displayIcon"></SelectIcon>
                    <InputGroupAddon>
                        <ColorPicker defaultColor="000000" v-model="fields.displayColor"></ColorPicker>
                    </InputGroupAddon>
                    <InputText v-model="fields.displayName" placeholder="Primary" />
                </InputGroup>
                <label>Category</label>
                <InputGroup>
                    <SelectCategory v-model="fields.categoryID" :stores="stores" />
                </InputGroup>
                <label>Custom</label>
                <InputGroup>
                    <InputText v-model="fields.displayImage" placeholder="Image URL" />
                    <InputText v-model="fields.displayURL" placeholder="URL" />
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls how this destination will shop up in the webinterface</Message>
            </div>

            <div class="flex flex-col gap-2 mb-8" v-if="renderField('mail')">
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