import { createRouter, createWebHistory } from 'vue-router'
import { AppState } from './AppState';

import UserWrapper from './views/user/UserWrapper.vue';
import UserHome from './views/user/UserHome.vue';
import UserCategories from './views/user/UserCategories.vue';
import UserDestinations from './views/user/UserDestinations.vue';
import UserAliases from './views/user/UserAliases.vue';
import AuthLoginView from './views/auth/AuthLoginView.vue'
import AuthCheckingView from './views/auth/AuthCheckingView.vue'
import AuthLogoutView from './views/auth/AuthLogoutView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "", redirect: "/user" },
    { path: "/user", component: UserWrapper, children: [
      { path: "", redirect: "/user/home" },
      { path: "categories", component: UserCategories, meta: { requireAuth: true } },
      { path: "home", component: UserHome, meta: { requireAuth: true } },
      { path: "destinations", component: UserDestinations, meta: { requireAuth: true } },
      { path: "aliases", component: UserAliases, meta: { requireAuth: true } },
    ] },
    { path: "/auth/login", component: AuthLoginView },
    { path: "/auth/checking", component: AuthCheckingView },
    { path: "/auth/logout", component: AuthLogoutView },
  ],
});

router.beforeEach((to, from) => {
  if(!to.meta.requireAuth) return true;
  if(AppState.authChecked == false) return { path: "/auth/checking", query: { originalPath: to.fullPath } };
  if(AppState.loggedIn == false) return { path: "/auth/login", query: { originalPath: to.fullPath } };
  return true;
});

export default router;