<script setup lang="ts">
import { APIClientPerspective } from '@/api/APIClient';
import { ref } from 'vue';
import SelectIcon from './SelectIcon.vue';

const { client } = defineProps<{ client: APIClientPerspective }>();

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
        await client.category.update(target.value, fields.value);
    else 
        await client.category.create(fields.value);
    show.value = false;
}
</script>

<template>
    <!-- MODIFY DIAGLOUE -->
        <Dialog v-model:visible="show" modal :header="target ? 'Update Category' : 'Create Category'" class="w-96">
            <div class="flex flex-col gap-2 mb-8" v-if="renderField('display')">
                <label>Display</label>
                <InputGroup>
                    <SelectIcon v-model="fields.displayIcon"></SelectIcon>
                    <InputGroupAddon>
                        <ColorPicker defaultColor="000000" v-model="fields.displayColor"></ColorPicker>
                    </InputGroupAddon>
                    <InputText v-model="fields.displayName" placeholder="Primary" />
                </InputGroup>
                <label>Custom</label>
                <InputGroup>
                    <InputText v-model="fields.displayImage" placeholder="Image URL" />
                    <InputText v-model="fields.displayURL" placeholder="URL" />
                </InputGroup>
                <Message size="small" severity="secondary" variant="simple">Controls how this category will shop up in the webinterface</Message>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Discard" severity="secondary" @click="show = false"></Button>
                <Button type="button" :label="target ? 'Update' : 'Create'" @click="createOrUpdate()"></Button>
            </div>
        </Dialog>
</template>