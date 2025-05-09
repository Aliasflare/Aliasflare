<script setup lang="ts">
import { AppState } from '@/AppState';
import Logo from '@/components/Logo.vue';
import router from '@/Router';
import MaterialSymbolsFormatListBulleted from '~icons/material-symbols/format-list-bulleted';
import MaterialSymbolsAccountCircle from '~icons/material-symbols/account-circle';
import MaterialSymbolsHome from '~icons/material-symbols/home';
import MaterialSymbolsMarkunreadMailbox from '~icons/material-symbols/markunread-mailbox';
import MaterialSymbolsCategory from '~icons/material-symbols/category';
import MaterialSymbolsPassword from '~icons/material-symbols/password';
import MaterialSymbolsSettings from '~icons/material-symbols/settings';
</script>

<template>
    <div class="UserWrapper h-full w-full flex flex-col">
        <div class="UserNavbar navbar bg-base-300 shadow-sm">
            <div class="navbar-start">
                <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <MaterialSymbolsFormatListBulleted></MaterialSymbolsFormatListBulleted>
                </div>
                <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li @click="$router.push({ path: '/user/home' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsHome></MaterialSymbolsHome> 
                            <a>Home</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/destinations' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsMarkunreadMailbox></MaterialSymbolsMarkunreadMailbox> 
                            <a>Destinations</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/aliasCategories' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsCategory></MaterialSymbolsCategory> 
                            <a>Categories</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/aliases' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsPassword></MaterialSymbolsPassword> 
                            <a>Aliases</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/settings' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsSettings></MaterialSymbolsSettings> 
                            <a>Settings</a>
                        </div>
                    </li>
                </ul>
                </div>
                <Logo class="w-32"></Logo>
            </div>
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li @click="$router.push({ path: '/user/home' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsHome></MaterialSymbolsHome> 
                            <a>Home</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/destinations' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsMarkunreadMailbox></MaterialSymbolsMarkunreadMailbox> 
                            <a>Destinations</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/aliasCategories' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsCategory></MaterialSymbolsCategory> 
                            <a>Categories</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/aliases' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsPassword></MaterialSymbolsPassword> 
                            <a>Aliases</a>
                        </div>
                    </li>
                    <li @click="$router.push({ path: '/user/settings' })">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsSettings></MaterialSymbolsSettings> 
                            <a>Settings</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="navbar-end">
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost">
                        <div class="flex flex-row items-center">
                            <MaterialSymbolsAccountCircle class="text-2xl"></MaterialSymbolsAccountCircle>
                            <div class="ml-2">{{ AppState.currentUser.username }}</div>
                        </div>
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li @click="router.push({ path: '/auth/logout' })"><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="UserContent flex flex-grow relative">
            <div class="UserContentNoFlexOverflow absolute w-full h-full overflow-auto p-4">
                <slot></slot>
            </div>
        </div>
    </div>

</template>