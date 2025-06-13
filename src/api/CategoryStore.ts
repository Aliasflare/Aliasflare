import { diff } from "@/Utils";
import { KeyedStore } from "./KeyedStore";

class CategoryStore extends KeyedStore {
    
    // ===== OBJECT METHODS =====
    async get(categoryId: string, fromCache: boolean = false) {
        if(fromCache && this.getKeyedObject(categoryId)) return this.getKeyedObject(categoryId);
        const res = await fetch("/api/category/get", {
            method: "POST",
            body: JSON.stringify({
                category: categoryId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).category);
    }

    async create(userId: string, newData: any) {
        const res = await fetch("/api/category/create", {
            method: "POST",
            body: JSON.stringify({
                ...newData,
                user: userId
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObject((await res.json()).category);
    }

    async update(categoryId: string, newData: any) {
        const res = await fetch("/api/category/update", {
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
        const res = await fetch("/api/category/delete", {
            method: "POST",
            body: JSON.stringify({
                category: categoryId,
            }),
        });
        if(res.status != 200) throw new Error(await res.text());
        this.removeKeyedObject(categoryId);
    }

    // ===== STATIC METHODS =====
    async list(userId: any, page: number = 0, limit: number = 50) {
        const res = await fetch("/api/category/list", {
            method: "POST",
            body: JSON.stringify({
                user: userId,
                page,
                limit
            })
        });
        if(res.status != 200) throw new Error(await res.text());
        return this.setKeyedObjects((await res.json()).categories);
    }

}

export const categoryStore = new CategoryStore();