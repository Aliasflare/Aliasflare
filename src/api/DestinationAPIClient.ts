import { diff } from "@/Utils";
import { APIStore } from "./APIStore";

export class DestinationAPIClient extends APIStore {
    
    // ===== OBJECT METHODS =====
    async get(destinationId: string, fromCache: boolean = false) {
        if(fromCache && this.getKeyedObject(destinationId)) return this.getKeyedObject(destinationId);
        const res = await this.clientPerspective.fetch("/api/destination/get", {
            method: "POST",
            body: JSON.stringify({
                destination: destinationId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).destination);
    }

    async create(newData: any) {
        const res = await this.clientPerspective.fetch("/api/destination/create", {
            method: "POST",
            body: JSON.stringify({
                ...newData,
                user: this.clientPerspective.userId
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).destination);
    }

    async update(destinationId: string, newData: any) {
        const res = await this.clientPerspective.fetch("/api/destination/update", {
            method: "POST",
            body: JSON.stringify({
                ...diff(this.getKeyedObject(destinationId), newData),
                destination: destinationId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).destination);
    }

    async delete(destinationId: string) {
        const res = await this.clientPerspective.fetch("/api/destination/delete", {
            method: "POST",
            body: JSON.stringify({
                destination: destinationId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        this.removeKeyedObject(destinationId);
    }

    async checkVerification(destinationId: string) {
        const res = await this.clientPerspective.fetch("/api/destination/checkVerification", {
            method: "POST",
            body: JSON.stringify({
                destination: destinationId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).destination);
    }

    // ===== STATIC METHODS =====
    async list(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/destination/list", {
            method: "POST",
            body: JSON.stringify({
                user: this.clientPerspective.userId,
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).destinations);
    }

    async listAll(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/destination/listAll", {
            method: "POST",
            body: JSON.stringify({
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).destinations);
    }
}