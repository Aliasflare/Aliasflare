import { db } from "../../database/D1DB";
import { ExtendedRequest } from "../ExtendedRequest";

export async function AttachAdmin(request: ExtendedRequest, env: any) {
    if(!db) throw new Error("Database error");

    const url = new URL(request.url);

    if(url.searchParams.get("godToken") == env.godToken) request.isAdmin = true;
    else request.isAdmin = request.user?.admin == 1;
}