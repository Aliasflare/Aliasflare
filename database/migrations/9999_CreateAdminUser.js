import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely} db 
 */
export async function up(db) {
  //User: admin
  //Password: AliasflareAdmin1234
  const sqls = [];
  sqls.push(
    {
      sql: `INSERT INTO "user" ("username", "mail", "passwordSalt", "passwordHash", "admin") values ('admin', 'admin@admin.com', 'ab97eea10560c4dab9a1a511064df20e', '1442710882c8ac050d16d155bb4a7122ea3d83ec96a74a16a03e01f2a99aa0b87a9a5058fc00070ecde503a78d8b5e6d564e1848ecdfa88d64e6adee51995c1ec56064b8dcbb9026061fc32aa496507a6b82d5f77516a121bd61660a2d0331738dd726d0e4667d0b410bb48c2fe0f553bea0fa44e48f2b948b9ce0fc89c37093050364cc3208856db283ec70370f8f8101d544b5eaa0c601456fe6ecc926e387c3761fa18d1d8129168fa83ab38ddbade6f1a685f64087498de8d35130c94d682f8254a467e6995639daa622c8f1e2cf8820544caee8432385c03884bc0f206a1e1272872848a4b2f080c036c4d93c0f768085c1c52b1d79ebd048f431d5f180', true);`
    }
  );
  return sqls
}

/**
 * @param {Kysely} db 
 */
export async function down(db) {
  const sqls = [];
  sqls.push(
    {
      sql: `DELETE FROM "user" where "username" == 'admin';`
    }
  );
  return sqls
}