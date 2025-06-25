<script setup lang="ts">
import { ref } from 'vue';
import { AppState } from '@/AppState';
import router from '@/Router';
import Logo from '@/componentsV2/Logo.vue';

const tabItems = ref([
    { route: '/admin/home', label: 'Home', icon: 'pi pi-home' },
    { route: '/admin/users', label: 'Users', icon: 'pi pi-user' },
    { route: '/admin/aliases', label: 'Aliases', icon: 'pi pi-eye-slash' },
    { route: '/admin/destinations', label: 'Destinations', icon: 'pi pi-inbox' },
]);

</script>

<template>
    <div class="AdminWrapper h-full w-full flex flex-col bg-base-300">
        <Message closable severity="warn" icon="pi pi-exclamation-triangle" v-if="AppState.hasUpdate"><b>Update(s) available!</b> Checkout <b><a href="https://github.com/Aliasflare/Aliasflare?tab=readme-ov-file#updating">https://github.com/Aliasflare/Aliasflare</a></b> for update instructions!</Message>
        <Menubar>
            <template #start>
                <Logo class="w-32" />
            </template>
            <template #end>
                <div class="flex flex-row justify-center gap-2">
                    <div class="font-bold text-xl text-red-500 top-0 bottom-0 my-auto">ADMIN MODE</div>
                    <Button icon="pi pi-user" severity="secondary" aria-label="User" @click="router.push({ path: '/user/' })" v-tooltip.bottom="'User Mode'" />
                    <Button severity="secondary" @click="$router.push({ path: '/user/settings' })">
                        <div>{{ AppState.apiClient.authKeyUser?.username }}</div>
                        <Avatar icon="pi pi-user" shape="circle" />
                    </Button>
                    <Button icon="pi pi-eject" severity="secondary" aria-label="Logout" @click="router.push({ path: '/auth/logout' })" v-tooltip.bottom="'Logout'" />
                </div>
            </template>
        </Menubar>
        <Tabs :value="router.currentRoute.value.fullPath" scrollable>
            <TabList>
                <Tab v-for="tab in tabItems" :key="tab.label" :value="tab.route" @click="router.push(tab.route)" >
                    <a class="flex items-center gap-2 text-inherit">
                        <i :class="tab.icon" />
                        <span>{{ tab.label }}</span>
                    </a>
                </Tab>
            </TabList>
        </Tabs>
        <div class="AdminContent flex flex-grow relative">
            <div class="AdminContentNoFlexOverflow absolute w-full h-full overflow-auto p-4">
                <router-view />
            </div>
        </div>
    </div>

</template>