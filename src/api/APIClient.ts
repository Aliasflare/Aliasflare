import { AliasAPIClient } from "./AliasAPIClient";
import { CategoryAPIClient } from "./CategoryAPIClient";
import { DestinationAPIClient } from "./DestinationAPIClient";
import { UserAPIClient } from "./UserAPIClient";
import { OtherAPIClient } from "./OtherAPIClient";

export class APIClient {
    authKey?: string;
    authKeyUser?: any;
    perspectives: APIClientPerspective[] = [];
    
    constructor() {
        this.authKey = window.localStorage.getItem("AUTH_KEY")||"";
    }

    withPerspective(userId?: string) {
        if(!userId) userId = this.authKeyUser?.id;
        const existent = this.perspectives.find(a => a.userId == userId);
        if(existent) return existent;
        console.log("[APIClient]", "New perspective", userId);
        this.perspectives.push(new APIClientPerspective(this, userId as any));
        return this.perspectives.find(a => a.userId == userId) as APIClientPerspective;
    }

    async login(username: string, password: string) {
        const res = await this.fetch("/api/authKey/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            }),
        });
        const resJSON = await res.json();
        if(res.status != 200 || resJSON.error) throw new Error(resJSON);
        this.authKey = resJSON.authKey;
        window.localStorage.setItem("AUTH_KEY", this.authKey||"");
    }

    async logout() {
        const res = await this.fetch("/api/authKey/logout", {
            method: "POST",
            body: JSON.stringify({})
        });
        const resJSON = await res.json();
        if(res.status != 200 || resJSON.error) throw new Error(resJSON);
        delete this.authKey;
        delete this.authKeyUser;
        window.localStorage.setItem("AUTH_KEY", this.authKey||"");
    }

    async validate() {
        const res = await this.fetch("/api/user/self", {
            method: "POST",
            body: JSON.stringify({ self: true })
        });
        const resJSON = await res.json();
        if(res.status != 200 || resJSON.error) {
            delete this.authKey;
            delete this.authKeyUser;
            window.localStorage.setItem("AUTH_KEY", this.authKey||"");
            throw new Error(resJSON);
        }
        this.authKeyUser = resJSON.user;
    }

    async fetch(url: string|URL, options: RequestInit) {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers||{}),
                ...this.authKey ? { 'Authorization': 'Basic ' + this.authKey } : {}
            }
        });
        return res;
    }
}

export class APIClientPerspective {

    client: APIClient;
    userId: string;

    userData?: any;
    userConfig?: any;

    alias: AliasAPIClient;
    category: CategoryAPIClient;
    destination: DestinationAPIClient;
    user: UserAPIClient;
    other: OtherAPIClient;

    constructor(client: APIClient, userId: string) {
        this.client = client;
        this.userId = userId;
        this.alias = new AliasAPIClient(this);
        this.category = new CategoryAPIClient(this);
        this.destination = new DestinationAPIClient(this);
        this.user = new UserAPIClient(this);
        this.other = new OtherAPIClient(this);
    }

    async prepare() {
        this.userData = await this.user.get(this.userId);
        this.userConfig = await this.other.config();
    }

    async fetch(url: string|URL, options: RequestInit) {
        return await this.client.fetch(url, options);
    }
}