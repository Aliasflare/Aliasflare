import { diff } from "@/Utils";
import { APIStore } from "./APIStore";

export class CategoryAPIClient extends APIStore {
    
    // ===== OBJECT METHODS =====
    async get(categoryId: string, fromCache: boolean = false) {
        if(fromCache && this.getKeyedObject(categoryId)) return this.getKeyedObject(categoryId);
        const res = await this.clientPerspective.fetch("/api/category/get", {
            method: "POST",
            body: JSON.stringify({
                category: categoryId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).category);
    }

    async create(newData: any) {
        const res = await this.clientPerspective.fetch("/api/category/create", {
            method: "POST",
            body: JSON.stringify({
                ...newData,
                user: this.clientPerspective.userId
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).category);
    }

    async update(categoryId: string, newData: any) {
        const res = await this.clientPerspective.fetch("/api/category/update", {
            method: "POST",
            body: JSON.stringify({
                ...diff(this.getKeyedObject(categoryId), newData),
                category: categoryId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).category);
    }

    async delete(categoryId: string) {
        const res = await this.clientPerspective.fetch("/api/category/delete", {
            method: "POST",
            body: JSON.stringify({
                category: categoryId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        this.removeKeyedObject(categoryId);
    }

    // ===== STATIC METHODS =====
    async list(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/category/list", {
            method: "POST",
            body: JSON.stringify({
                user: this.clientPerspective.userId,
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).categories);
    }

    async listAll(page: number = 0, limit: number = 50) {
        const res = await this.clientPerspective.fetch("/api/category/listAll", {
            method: "POST",
            body: JSON.stringify({
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).categories);
    }
}