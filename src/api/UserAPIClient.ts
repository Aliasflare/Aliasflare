import { diff } from "@/Utils";
import { APIStore } from "./APIStore";

export class UserAPIClient extends APIStore {
    
    selfId?: string;

    // ===== OBJECT METHODS =====
    async self() {
        const res = await this.clientPerspective.fetch("/api/user/self", {
            method: "POST",
            body: JSON.stringify({
                self: true,
            }),
        });
        if(res.status != 200) {
            this.selfId = undefined;
            throw new Error(await res.text());
        }
        const u = (await res.json()).user;
        this.selfId = u.id;
        return this.setKeyedObject(u);
    }

    async get(userId: string, fromCache: boolean = false) {
        if(fromCache && this.getKeyedObject(userId)) return this.getKeyedObject(userId);
        const res = await this.clientPerspective.fetch("/api/user/get", {
            method: "POST",
            body: JSON.stringify({
                user: userId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).user);
    }

    async getSelf(fromCache: boolean = false) {
        return await this.get(this.clientPerspective.userId, fromCache);
    }

    async create(newData: any) {
        const res = await this.clientPerspective.fetch("/api/user/create", {
            method: "POST",
            body: JSON.stringify({
                ...newData,
                user: this.clientPerspective.userId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).user);
    }

    async update(userId: string, newData: any) {
        const res = await this.clientPerspective.fetch("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
                ...diff(this.getKeyedObject(userId), newData),
                user: userId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).user);
    }

    async delete(userId: string) {
        const res = await this.clientPerspective.fetch("/api/user/delete", {
            method: "POST",
            body: JSON.stringify({
                user: userId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        this.removeKeyedObject(userId);
    }

    // ===== STATIC METHODS =====
    async list(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/user/list", {
            method: "POST",
            body: JSON.stringify({
                user: this.clientPerspective.userId,
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).users);
    }

    async listAll(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/user/listAll", {
            method: "POST",
            body: JSON.stringify({
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).users);
    }
}