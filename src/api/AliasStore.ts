import { diff } from "@/Utils";
import { KeyedStore } from "./KeyedStore";

class AliasStore extends KeyedStore {
    
    // ===== OBJECT METHODS =====
    async get(aliasId: string, fromCache: boolean = false) {
        if(fromCache && this.getKeyedObject(aliasId)) return this.getKeyedObject(aliasId);
        const res = await fetch("/api/alias/get", {
            method: "POST",
            body: JSON.stringify({
                alias: aliasId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).alias);
    }

    async create(userId: string, newData: any) {
        const res = await fetch("/api/alias/create", {
            method: "POST",
            body: JSON.stringify({
                ...newData,
                user: userId
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).alias);
    }

    async update(aliasId: string, newData: any) {
        console.log(aliasId, newData);
        const res = await fetch("/api/alias/update", {
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
        const res = await fetch("/api/alias/delete", {
            method: "POST",
            body: JSON.stringify({
                alias: aliasId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        this.removeKeyedObject(aliasId);
    }

    // ===== STATIC METHODS =====
    async list(userId: any, page: number = 0, limit: number = 50) {
        const res = await fetch("/api/alias/list", {
            method: "POST",
            body: JSON.stringify({
                user: userId,
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).aliases);
    }

}

export const aliasStore = new AliasStore();