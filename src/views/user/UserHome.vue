<script setup lang="ts">
import { AppState } from '@/AppState';
import UserWrapper from './UserWrapper.vue';
</script>

<template>
    <UserWrapper>
        <div class="text-2xl m-2">Welcome '{{ AppState.currentUser.username }}'!</div>
        <div class="m-2">
            <div>👏 Thank you very much for testing AliasFlare in it's early stages!</div>
            <div class="text-purple-500">🚧 If you encounter any bugs, please report them directly to me</div>
            <div class="text-red-500">⚠️ DO NOT USE THIS INSTANCE FOR ANYTHING REMOTELY IMPORTANT!</div>
        </div>
    </UserWrapper>
</template>