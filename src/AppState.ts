import { reactive } from "vue";

export const AppState = reactive<{
    authChecked: boolean,
    authUserId: any|null,
    authUser: any|null,

    config: null|any
    prepared: boolean
}>({
    authChecked: false,
    authUserId: null,
    authUser: null,
    config: null,
    prepared: false
});