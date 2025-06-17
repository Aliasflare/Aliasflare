import { reactive, type Reactive } from "vue";

export class KeyedStore {

    data: Reactive<Array<any>>;
    constructor() {
        this.data = reactive([]);
    }

    setKeyedObjects(objs: any) {
        return objs.map((a: any) => this.setKeyedObject(a));
    }

    setKeyedObject(obj: any) {
        if(!obj.id) throw new Error("Cannot set object without id!");
        const existent = this.data.find(a => a.id == obj.id);
        if(!existent) this.data[this.data.push(new Object(obj))];
        else Object.assign(existent, obj);
        return this.data.find(a => a.id == obj.id);
    }

    getKeyedObject(id: any) {
        return this.data.find(a => a.id == id);
    }

    getKeyedObjects() {
        return this.data;
    }

    removeKeyedObject(id: any) {
        this.data.splice(this.data.findIndex(a => a.id == id), 1);
    }
}