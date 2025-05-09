<script setup lang="ts">
const emit = defineEmits<{
    backdropClicked: [undefined]
}>();
</script>

<template>
    <Teleport to="body">
        <div class="SidebarModalWrapper absolute w-full h-full top-0 left-0 z-10 bg-base-content/20" @click.self="emit('backdropClicked', undefined)">
            <div class="SidebarModal absolute right-0 top-0 h-full w-full sm:w-[32rem] bg-base-100 sm:rounded-l-xl overflow-auto">
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>