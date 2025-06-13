<script setup lang="ts">
import { ref } from 'vue';
import { AppState } from '@/AppState';
import router from '@/Router';
import Logo from '@/components/Logo.vue';

const tabItems = ref([
    { route: '/user/home', label: 'Home', icon: 'pi pi-home' },
    { route: '/user/destinations', label: 'Destinations', icon: 'pi pi-inbox' },
    { route: '/user/aliases', label: 'Aliases', icon: 'pi pi-eye-slash' },
]);

</script>

<template>
    <div class="UserWrapper h-full w-full flex flex-col bg-base-300">
        <Menubar>
            <template #start>
                <Logo class="w-32" />
            </template>
            <template #end>
                <div class="flex flex-row justify-center gap-2">
                    <Button severity="secondary" @click="$router.push({ path: '/user/settings' })">
                        <div>{{ AppState.currentUser.username }}</div>
                        <Avatar icon="pi pi-user" shape="circle" />
                    </Button>
                    <Button icon="pi pi-eject" severity="secondary" aria-label="Logout" @click="router.push({ path: '/auth/logout' })" v-tooltip.bottom="'Logout'" />
                </div>
            </template>
        </Menubar>
        <Tabs :value="router.currentRoute.value.fullPath">
            <TabList>
                <Tab v-for="tab in tabItems" :key="tab.label" :value="tab.route" @click="router.push(tab.route)" >
                    <a class="flex items-center gap-2 text-inherit">
                        <i :class="tab.icon" />
                        <span>{{ tab.label }}</span>
                    </a>
                </Tab>
            </TabList>
        </Tabs>
        <div class="UserContent flex flex-grow relative">
            <div class="UserContentNoFlexOverflow absolute w-full h-full overflow-auto p-4">
                <router-view />
            </div>
        </div>
    </div>

</template>