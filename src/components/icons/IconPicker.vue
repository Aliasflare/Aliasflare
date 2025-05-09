<script setup lang="ts">
import IconPicked from './IconPicked.vue';
import { IconMap } from './Icons';
let icon = defineModel<string|undefined>({ required: true });
</script>

<template>
    <div class="IconPicker">
        <details class="dropdown">
            <summary class="btn">
                <IconPicked :icon="icon"></IconPicked>
            </summary>
            <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-48 p-2 shadow-sm flex flex-row flex-wrap justify-center">
                <li v-for="pickableIcon in Object.keys(IconMap)" @click="icon = pickableIcon">
                    <div class="w-fit h-fit">
                        <IconPicked :icon="pickableIcon"></IconPicked>
                    </div>
                </li>
            </ul>
        </details>
    </div>
</template>