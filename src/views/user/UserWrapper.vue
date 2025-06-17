<script setup lang="ts">
import { ref, watch } from 'vue';
import { AppState } from '@/AppState';
import router from '@/Router';
import Logo from '@/componentsV2/Logo.vue';
import { Stores } from '@/api/Stores';

const tabItems = ref([
    { route: '/user/:userId?/home', label: 'Home', icon: 'pi pi-home' },
    { route: '/user/:userId?/categories', label: 'Categories', icon: 'pi pi-tags' },
    { route: '/user/:userId?/destinations', label: 'Destinations', icon: 'pi pi-inbox' },
    { route: '/user/:userId?/aliases', label: 'Aliases', icon: 'pi pi-eye-slash' },
    { route: '/user/:userId?/settings', label: 'Settings', icon: 'pi pi-cog' },
]);

watch(() => AppState.viewAsUserId, () => {
    Stores.withPerspective(AppState.viewAsUserId).userStore.get(AppState.viewAsUserId);
    
}, { immediate: true });
</script>

<template>
    <div class="UserWrapper h-full w-full flex flex-col bg-base-300">
        <Menubar>
            <template #start>
                <Logo class="w-32" />
            </template>
            <template #end>
                <div class="flex flex-row justify-center gap-2">
                    <div class="font-bold text-xl text-red-500 top-0 bottom-0 my-auto" v-if="AppState.authUserId != AppState.viewAsUserId">VIEWING AS ANOTHER USER</div>
                    <Button icon="pi pi-server" severity="secondary" aria-label="Admin" @click="router.push({ path: '/admin/' })" v-tooltip.bottom="'Admin Mode'" v-if="AppState.authUser?.admin" />
                    <Button severity="secondary" @click="$router.push({ path: '/user/settings' })">
                        <div>{{ AppState.authUser.username }}</div>
                        <Avatar icon="pi pi-user" shape="circle" />
                    </Button>
                    <Button icon="pi pi-eject" severity="secondary" aria-label="Logout" @click="router.push({ path: '/auth/logout' })" v-tooltip.bottom="'Logout'" />
                </div>
            </template>
        </Menubar>
        <Tabs :value="router.currentRoute.value.matched.at(-1)?.path||0" scrollable>
            <TabList>
                <Tab v-for="tab in tabItems" :key="tab.label" :value="tab.route" @click="router.push({ path: tab.route.replaceAll(':userId?/', router.currentRoute.value.params.userId ? router.currentRoute.value.params.userId + '/' : '') })" >
                    <a class="flex items-center gap-2 text-inherit">
                        <i :class="tab.icon" />
                        <span>{{ tab.label }}</span>
                    </a>
                </Tab>
            </TabList>
        </Tabs>
        <div class="UserContent flex flex-grow relative" v-if="Stores.withPerspective(AppState.viewAsUserId).userStore.getKeyedObject(AppState.viewAsUserId)">
            <div class="UserContentNoFlexOverflow absolute w-full h-full overflow-auto p-4">
                <router-view :stores="Stores.withPerspective(AppState.viewAsUserId)" />
            </div>
        </div>
        <div class="m-4" v-else>Loading user...</div>
    </div>
</template>