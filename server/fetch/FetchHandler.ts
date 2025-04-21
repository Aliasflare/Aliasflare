import { initDBFetchHandler } from "../database/D1DB";
import { ExtendedRequest } from './ExtendedRequest'
import { AttachSession } from "./auth/AttachSession";
import { AttachUser } from "./auth/AttachUser";
import { AttachAdmin } from "./auth/AttachAdmin";
import { AuthLogin } from "./auth/AuthLogin";
import { GenericApi } from "./GenericApi";
import { CreateUser } from "./users/CreateUser";
import { GetUser } from "./users/GetUser";
import { ListUser } from "./users/ListUser";
import { AuthLogout } from "./auth/AuthLogout";
import { AliasCreate } from "./alias/AliasCreate";
import { AliasGet } from "./alias/AliasGet";
import { AliasList } from "./alias/AliasList";
import { DeleteUser } from "./users/DeleteUser";
import { UpdateUser } from "./users/UpdateUser";

const fetchHandlers = [
    initDBFetchHandler,
    AttachSession,
    AttachUser,
    AttachAdmin,
    AuthLogin,
    AuthLogout,
    CreateUser,
    GetUser,
    ListUser,
    DeleteUser,
    UpdateUser,
    AliasCreate,
    AliasGet,
    AliasList,
    GenericApi,
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