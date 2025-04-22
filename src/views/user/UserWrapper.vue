<script setup lang="ts">
import { AppState } from '@/AppState';
import Logo from '@/components/Logo.vue';
import router from '@/Router';
import MaterialSymbolsFormatListBulleted from '~icons/material-symbols/format-list-bulleted';
import MaterialSymbolsAccountCircle from '~icons/material-symbols/account-circle';
</script>

<template>
    <div class="UserWrapper h-full w-full flex flex-col">
        <div class="UserNavbar navbar bg-base-100 shadow-sm">
            <div class="navbar-start">
                <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                    <MaterialSymbolsFormatListBulleted></MaterialSymbolsFormatListBulleted>
                </div>
                <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li @click="$router.push({ path: '/user/home' })"><a>Home</a></li>
                    <li @click="$router.push({ path: '/user/aliases' })"><a>Aliases</a></li>
                    <li @click="$router.push({ path: '/user/tempmail' })"><a>TempMail</a></li>
                    <li @click="$router.push({ path: '/admin/home' })" v-if="AppState.currentUser.admin"><a>Admin</a></li>
                </ul>
                </div>
                <Logo class="w-32"></Logo>
            </div>
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                <li @click="$router.push({ path: '/user/home' })"><a>Home</a></li>
                <li @click="$router.push({ path: '/user/aliases' })"><a>Aliases</a></li>
                <li @click="$router.push({ path: '/user/tempmail' })"><a>TempMail</a></li>
                <li @click="$router.push({ path: '/admin/home' })" v-if="AppState.currentUser.admin"><a>Admin</a></li>
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
                        <li @click="router.push({ path: '/user/account' })"><a>Account</a></li>
                        <li @click="router.push({ path: '/auth/logout' })"><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="UserContent flex flex-grow relative p-4">
            <div class="UserContentNoFlexOverflow absolute w-full h-full overflow-auto">
                <slot></slot>
            </div>
        </div>
    </div>

</template>