import { createRouter, createWebHistory } from 'vue-router'
import AuthLoginView from './views/auth/AuthLoginView.vue'
import AuthCheckingView from './views/auth/AuthCheckingView.vue'
import UserHome from './views/user/UserHome.vue';
import { AppState } from './AppState';
import AuthLogoutView from './views/auth/AuthLogoutView.vue';
import UserAliases from './views/user/UserAliases.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "", redirect: "/user/home" },
    { path: "/auth/login", component: AuthLoginView },
    { path: "/auth/checking", component: AuthCheckingView },
    { path: "/auth/logout", component: AuthLogoutView },
    { path: "/user/home", component: UserHome, meta: { requireAuth: true } },
    { path: "/user/aliases", component: UserAliases, meta: { requireAuth: true } }
  ],
});

router.beforeEach((to, from) => {
  if(!to.meta.requireAuth) return true;
  if(AppState.authChecked == false) return { path: "/auth/checking", query: { originalPath: to.fullPath } };
  if(AppState.loggedIn == false) return { path: "/auth/login", query: { originalPath: to.fullPath } };
  return true;
});

export default router;