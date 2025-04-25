import { ExtendedRequest } from './ExtendedRequest'

//Handlers
import { initDBFetchHandler } from "../Database";
import { AttachSession } from "./auth/AttachSession";
import { AttachUser } from "./auth/AttachUser";
import { AttachAdmin } from "./auth/AttachAdmin";
import { AuthLogin } from "./auth/AuthLogin";
import { AuthLogout } from "./auth/AuthLogout";
import { UserCreate } from "./user/UserCreate";
import { UserGet } from "./user/UserGet";
import { UserList } from "./user/UserList";
import { UserDelete } from "./user/UserDelete";
import { UserUpdate } from "./user/UserUpdate";
import { DestinationCreate } from "./destination/DestinationCreate";
import { DestinationDelete } from "./destination/DestinationDelete";
import { DestinationGet } from "./destination/DestinationGet";
import { DestinationUpdate } from "./destination/DestinationUpdate";
import { AliasCreate } from "./alias/AliasCreate";
import { AliasGet } from "./alias/AliasGet";
import { AliasList } from "./alias/AliasList";
import { AliasUpdate } from "./alias/AliasUpdate";
import { GenericApi } from "./GenericApi";
const fetchHandlers = [
    ...[initDBFetchHandler, AttachSession, AttachUser, AttachAdmin],
    ...[AuthLogin, AuthLogout],
    ...[UserCreate, UserDelete, UserGet, UserList, UserUpdate],
    ...[DestinationCreate, DestinationDelete, DestinationGet, DestinationUpdate],
    ...[AliasCreate, AliasGet, AliasList, AliasUpdate],
    ...[GenericApi],
]

export async function FetchHandler(request: Request, env: any):Promise<Response> {
    for(const handler of fetchHandlers) {
        try {
            console.log("[FetchHandler]", "Executing handler '" + handler.name + "'");
            const res = await handler(request as ExtendedRequest, env);
            if(res instanceof Response) {
                res.headers.set("X-Handler", handler.name);
                console.log("[FetchHandler]", "Response from handler '" + handler.name + "'");
                return res;
            }
            else console.log("[FetchHandler]", "Skipped handler '" + handler.name + "'");
        } catch(err) {
            console.error("[FetchHandler]", "Handler failed '" + handler.name + "'");
            console.error(err);
            return new Response("Internal server error", { 
                status: 500,
                headers: {
                    'X-Handler': handler.name
                }
            });
        }
    }
    //Respond with 404 -> Webapp which will then show the 404 Page
    return new Response(null, { status: 404 });
}