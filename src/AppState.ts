import { reactive } from "vue";
import { APIClient } from "./api/APIClient";

export const AppState = reactive<{
    apiClient: APIClient;
    viewAsUserId: any|null,

    config: null|any
    prepared: boolean,
    hasUpdate: boolean,
}>({
    apiClient: new APIClient(),
    viewAsUserId: null,
    
    config: null,
    prepared: false,
    hasUpdate: false,
});