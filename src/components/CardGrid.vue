<template>
  <v-container fluid class="CardGrid">
    <v-row>
        <v-col v-for="(child, index) in slotChildren" :key="index">
            <component :is="child"></component>
        </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const slots = useSlots();
const slotChildren = computed(() => {
    return slots.default()[0].children;
});
</script>