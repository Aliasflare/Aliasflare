<script setup lang="ts">
import { Stores } from '@/api/Stores';
const { stores } = defineProps<{ stores: Stores }>();
</script>

<template>
    <div class="text-2xl m-2">Welcome '{{ stores.userStore.getKeyedObject(stores.perspective)?.username || 'Unknown' }}'!</div>
    <div class="m-2">
        <div>👏 Thank you very much for testing AliasFlare in it's early stages!</div>
        <div class="text-purple-500">🚧 If you encounter any bugs, please report them directly to me</div>
        <div class="text-red-500">⚠️ DO NOT USE THIS INSTANCE FOR ANYTHING REMOTELY IMPORTANT!</div>
    </div>
</template>