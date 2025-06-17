<script setup lang="ts">
import { AppState } from '@/AppState';
import { Stores } from '@/api/Stores';
import { ref } from 'vue';

const { stores } = defineProps<{ stores: Stores }>();

const showFields = ref<undefined|string[]>();
function renderField(field: string) { return !showFields.value || showFields.value?.includes('*') || showFields.value?.includes(field); }

const show = ref(false);
const target = ref<undefined|string>(undefined);
const fields = ref<any>({});

function handleUpdate(user: any, pShowFields?: string[]) {
    target.value = user.id;
    fields.value = {};
    Object.assign(fields.value, user);
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
        await stores.userStore.update(target.value, fields.value);
    else 
        await stores.userStore.create(stores.perspective, fields.value);
    show.value = false;
}
</script>

<template>
    <!-- MODIFY DIAGLOUE -->
        <Dialog v-model:visible="show" modal :header="target ? 'Update User' : 'Create User'" class="w-96">
            <div class="flex flex-col gap-2 mb-8" v-if="renderField('username')">
                <label>Username</label>
                <InputGroup>
                    <InputText v-model="fields.username" type="username" placeholder="Username" />
                </InputGroup>
            </div>

            <div class="flex flex-col gap-2 mb-8" v-if="renderField('password')">
                <label>Password</label>
                <InputGroup>
                    <InputText v-model="fields.password" type="password" placeholder="Password" />
                </InputGroup>
            </div>

            <div class="flex flex-col gap-2 mb-8" v-if="renderField('mail')">
                <label>Mail</label>
                <InputGroup>
                    <InputText v-model="fields.mail" type="mail" placeholder="mustermann" />
                </InputGroup>
            </div>

            <div class="flex flex-col gap-2 mb-8" v-if="renderField('admin')">
                <label>Admin</label>
                <InputGroup>
                    <ToggleSwitch v-model="fields.admin" />
                </InputGroup>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Discard" severity="secondary" @click="show = false"></Button>
                <Button type="button" :label="target ? 'Update' : 'Create'" @click="createOrUpdate()"></Button>
            </div>
        </Dialog>
</template>