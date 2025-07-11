import { diff } from "@/Utils";
import { APIStore } from "./APIStore";

export class AliasAPIClient extends APIStore {
    
    // ===== OBJECT METHODS =====
    async get(aliasId: string, fromCache: boolean = false) {
        if(fromCache && this.getKeyedObject(aliasId)) return this.getKeyedObject(aliasId);
        const res = await this.clientPerspective.fetch("/api/alias/get", {
            method: "POST",
            body: JSON.stringify({
                alias: aliasId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).alias);
    }

    async create(newData: any) {
        const res = await this.clientPerspective.fetch("/api/alias/create", {
            method: "POST",
            body: JSON.stringify({
                ...newData,
                user: this.clientPerspective.userId
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).alias);
    }

    async update(aliasId: string, newData: any) {
        const res = await this.clientPerspective.fetch("/api/alias/update", {
            method: "POST",
            body: JSON.stringify({
                ...diff(this.getKeyedObject(aliasId), newData),
                alias: aliasId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).alias);
    }

    async delete(aliasId: string) {
        const res = await this.clientPerspective.fetch("/api/alias/delete", {
            method: "POST",
            body: JSON.stringify({
                alias: aliasId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        this.removeKeyedObject(aliasId);
    }

    // ===== STATIC METHODS =====
    async list(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/alias/list", {
            method: "POST",
            body: JSON.stringify({
                user: this.clientPerspective.userId,
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).aliases);
    }

    async listAll(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/alias/listAll", {
            method: "POST",
            body: JSON.stringify({
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).aliases);
    }
}