import { createRouter, createWebHistory } from 'vue-router'
import { AppState } from './AppState';

import UserWrapper from './views/user/UserWrapper.vue';
import UserHome from './views/user/UserHome.vue';
import UserCategories from './views/user/UserCategories.vue';
import UserDestinations from './views/user/UserDestinations.vue';
import UserAliases from './views/user/UserAliases.vue';
import UserSettings from './views/user/UserSettings.vue';
import AdminWrapper from './views/admin/AdminWrapper.vue';
import AdminHome from './views/admin/AdminHome.vue';
import AdminUsers from './views/admin/AdminUsers.vue';
import AdminDestinations from './views/admin/AdminDestinations.vue';
import AdminAliases from './views/admin/AdminAliases.vue';
import AuthLoginView from './views/auth/AuthLoginView.vue'
import AuthCheckingView from './views/auth/AuthCheckingView.vue'
import AuthLogoutView from './views/auth/AuthLogoutView.vue';
import AuthPrepareView from './views/auth/AuthPrepareView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "", redirect: "/user" },
    { path: "/user/:userId?", component: UserWrapper, children: [
      { path: "", redirect: "/user/home" },
      { path: "categories", component: UserCategories, meta: { requireAuth: true, requirePrepared: true } },
      { path: "home", component: UserHome, meta: { requireAuth: true, requirePrepared: true } },
      { path: "destinations", component: UserDestinations, meta: { requireAuth: true, requirePrepared: true } },
      { path: "aliases", component: UserAliases, meta: { requireAuth: true, requirePrepared: true } },
      { path: "settings", component: UserSettings, meta: { requireAuth: true, requirePrepared: true } },
    ] },
    { path: "/admin", component: AdminWrapper, children: [
      { path: "", redirect: "/admin/home" },
      { path: "home", component: AdminHome, meta: { requireAuth: true, requirePrepared: true, requireAdmin: true } },
      { path: "users", component: AdminUsers, meta: { requireAuth: true, requirePrepared: true, requireAdmin: true } },
      { path: "destinations", component: AdminDestinations, meta: { requireAuth: true, requirePrepared: true, requireAdmin: true } },
      { path: "aliases", component: AdminAliases, meta: { requireAuth: true, requirePrepared: true, requireAdmin: true } },
    ] },
    { path: "/auth/login", component: AuthLoginView },
    { path: "/auth/checking", component: AuthCheckingView },
    { path: "/auth/logout", component: AuthLogoutView },
    { path: "/auth/prepare", component: AuthPrepareView, meta: { requireAuth: true } },
  ],
});

router.beforeEach((to, from) => {
  if(to.meta.requireAuth) {
    if(AppState.apiClient.authKey && !AppState.apiClient.authKeyUser) return { path: "/auth/checking", query: { originalPath: to.fullPath } };
    if(!AppState.apiClient.authKey) return { path: "/auth/login", query: { originalPath: to.fullPath } };
  }

  if(to.meta.requireAdmin) {
    if(!AppState.apiClient.authKeyUser?.admin) return { path: "/user/home", query: { originalPath: to.fullPath } };
  }

  AppState.viewAsUserId = to.params.userId;
  
  if(to.meta.requirePrepared) {
      if(AppState.prepared == false) return { path: "/auth/prepare", query: { originalPath: to.fullPath } };
  }
  
  return true;
});

export default router;