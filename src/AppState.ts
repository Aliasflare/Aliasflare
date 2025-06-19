import { reactive } from "vue";

export const AppState = reactive<{
    authChecked: boolean,
    authUserId: any|null,
    authUser: any|null,
    viewAsUserId: any|null,

    config: null|any
    prepared: boolean,
    hasUpdate: boolean,
}>({
    authChecked: false,
    authUserId: null,
    authUser: null,
    config: null,
    prepared: false,
    viewAsUserId: null,
    hasUpdate: false,
});