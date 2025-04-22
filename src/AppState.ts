import { reactive } from "vue";

export const AppState = reactive<{
    authChecked: boolean,
    loggedIn: boolean,
    currentUser: null|any
}>({
    authChecked: false,
    loggedIn: false,
    currentUser: null,
});