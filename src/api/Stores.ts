import { AliasStore } from "./AliasStore";
import { CategoryStore } from "./CategoryStore";
import { DestinationStore } from "./DestinationStore";
import { UserStore } from "./UserStore";

export class Stores {

    perspective: string;

    aliasStore: AliasStore;
    categoryStore: CategoryStore;
    destinationStore: DestinationStore;
    userStore: UserStore;

    constructor(perspective: string) {
        this.perspective = perspective;
        this.aliasStore = new AliasStore();
        this.categoryStore = new CategoryStore();
        this.destinationStore = new DestinationStore();
        this.userStore = new UserStore();
    }

    static STORES:Record<string, Stores> = {};
    static withPerspective(perspective: string = "DEFAULT") {
        if(!this.STORES[perspective]) {
            this.STORES[perspective] = new this(perspective);
            console.log("[Stores] New perspective:", perspective);
        }
        return this.STORES[perspective];
    }
}