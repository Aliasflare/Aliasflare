import { reactive } from "vue";

export const AppState = reactive<{
    authChecked: boolean,
    loggedIn: boolean,
    currentUser: null|any,
    config: null|any
    prepared: boolean
}>({
    authChecked: false,
    loggedIn: false,
    currentUser: null,
    config: null,
    prepared: false
});