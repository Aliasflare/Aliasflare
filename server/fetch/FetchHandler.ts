import { ExtendedRequest } from './ExtendedRequest'

//Handlers
import { initDBFetchHandler } from "../Database";
import { initCloudflareClientFetchHandler } from '../CloudflareClient';
import { AttachSession } from "./auth/AttachSession";
import { AttachUser } from "./auth/AttachUser";
import { AttachAdmin } from "./auth/AttachAdmin";
import { AuthLogin } from "./auth/AuthLogin";
import { AuthLogout } from "./auth/AuthLogout";
import { UserCreate } from "./user/UserCreate";
import { UserGet } from "./user/UserGet";
import { UserList } from "./user/UserList";
import { UserSelf } from './user/UserSelf';
import { UserDelete } from "./user/UserDelete";
import { UserUpdate } from "./user/UserUpdate";
import { DestinationCheckVerification } from './destination/DestinationCheckVerification';
import { DestinationCreate } from "./destination/DestinationCreate";
import { DestinationDelete } from "./destination/DestinationDelete";
import { DestinationGet } from "./destination/DestinationGet";
import { DestinationList } from './destination/DestinationList';
import { DestinationUpdate } from "./destination/DestinationUpdate";
import { AliasCreate } from "./alias/AliasCreate";
import { AliasDelete } from './alias/AliasDelete';
import { AliasGet } from "./alias/AliasGet";
import { AliasList } from "./alias/AliasList";
import { AliasUpdate } from "./alias/AliasUpdate";
import { CategoryCreate } from './category/CategoryCreate';
import { CategoryUpdate } from './category/CategoryUpdate';
import { CategoryGet } from './category/CategoryGet';
import { CategoryList } from './category/CategoryList';
import { CategoryDelete } from './category/CategoryDelete';
import { GenericApi } from "./GenericApi";

const fetchHandlers = [
    ...[initDBFetchHandler, initCloudflareClientFetchHandler, AttachSession, AttachUser, AttachAdmin],
    ...[AuthLogin, AuthLogout],
    ...[UserCreate, UserDelete, UserGet, UserList, UserSelf, UserUpdate],
    ...[DestinationCheckVerification, DestinationCreate, DestinationDelete, DestinationGet, DestinationList, DestinationUpdate],
    ...[AliasCreate, AliasDelete, AliasGet, AliasList, AliasUpdate],
    ...[CategoryCreate, CategoryDelete, CategoryGet, CategoryList, CategoryUpdate],
    ...[GenericApi],
];

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