<template>
    <div class="AuthBox w-full h-full flex flex-col items-center justify-center">
        <div class="AuthBoxContent h-full w-full sm:h-fit grow sm:grow-0 relative p-8 bg-base-300 sm:rounded-xl sm:w-96"> <!-- Fullscreen on Mobile, Box on Desktop -->
            <slot></slot>
        </div>
    </div>
</template>