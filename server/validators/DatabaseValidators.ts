import { db, DBTable, DBTableColumn, DBTableFullObject } from "../Database";
import { ZodString } from "./BasicValidators";

export const ExistsInTableFilter = <T extends DBTable>(table: T, column: DBTableColumn<T>) => async(a: any) => {
    if(!db) throw new Error("Database error");
    const c= (await db
      .selectFrom(table)
      //@ts-ignore
      .select(column)
      .where(column, "==", a)
      .limit(1)
      .executeTakeFirst()) !== undefined;
    return c;
};
  
export const NotExistsInTableFilter = <T extends DBTable>(table: T, column: DBTableColumn<T>) => async(a: any) => !ExistsInTableFilter(table, column)(a);

export const ZodObjectFromTable = <T extends DBTable>(table: T, column: DBTableColumn<T>) => ZodString
    .transform(async(a: any) => {
    if(!db) throw new Error("Database error");
    return (await db
        .selectFrom(table)
        .selectAll()
        //@ts-expect-error
        .where(column, "==", a)
        .limit(1)
        .executeTakeFirst()) as (DBTableFullObject<T>);
    })
    .refine(a => a!= undefined, "Must be a valid '" + column + "' of '" + table + "'")
    .transform(a => a as DBTableFullObject<T>);

export const ZodAccessibleObjectFromTable = <T extends DBTable>(table: T, column: DBTableColumn<T>) =>
    (userId: string|null|undefined, isAdmin:boolean) => ZodObjectFromTable(table, column)
        .refine(a => a==undefined || isAdmin || userId != null, "Must be logged or admin to access data")
        .refine(a => a==undefined || isAdmin || (a as any).userId == userId, "Must be admin to access other users data");

        /*
export const ZodUserTarget = (request: ExtendedRequest, env: Env) => z
    .object({
        userId: ZodUUID.refine(ExistsInTableFilter("user", "id")).optional(),
        self: ZodBoolean.optional()
    })
    .refine(a => a.self||a.userId, "Must specify either userId or self")
    .refine(a => a.self == undefined || request.user, "Must be signed in to operate on self")
    .transform(a => ({ ...a, userId: a.userId||request.user?.id as string }))
    .refine(a => a.userId == request.user?.id ||request.isAdmin, "Must be admin to operates as other user")
    .refine(ExistsInTableFilter("user", "id"), "Must be an existing user");*/