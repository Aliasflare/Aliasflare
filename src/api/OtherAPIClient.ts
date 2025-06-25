import { APIStore } from "./APIStore";
export class OtherAPIClient extends APIStore {
    
    async config() {
        const res = await this.clientPerspective.fetch("/api/config", {
            method: "POST",
            body: JSON.stringify({
                user: this.clientPerspective.userId
            }),
        });
        return (await res.json()).config;
    }

}