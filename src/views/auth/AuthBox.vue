<template>
    <Dialog :visible="true" modal header="Authentication" :closable="false" :dismissableMask="false" :closeOnEscape="false" class="w-96">
        <slot></slot>
    </Dialog>
</template>