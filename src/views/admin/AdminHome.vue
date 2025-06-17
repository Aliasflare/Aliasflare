<script setup lang="ts">
import { AppState } from '@/AppState';
</script>

<template>
    <div class="text-2xl m-2">Welcome '{{ AppState.currentUser.username }}'!</div>
    <div class="m-2">
        <div class="text-red-500">YOU ARE AN ADMIN!!!</div>
    </div>
</template>