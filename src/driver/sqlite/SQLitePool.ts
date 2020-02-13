/* eslint-disable @typescript-eslint/no-var-requires */
export class SQLitePool {
  private pool: any;

  constructor(path: string, options?: object | boolean | number) {
    const { Pool } = require('better-sqlite-pool');
    this.pool = new Pool(path, options);
  }

  public async getConnection(cb) {
    if (cb) {
      try {
        const db = await this.pool.acquire();
        cb(null, db);
      } catch (e) {
        cb(e, null);
      }
      return null;
    } else {
      return await this.pool.acquire();
    }
  }
}

/*
// use async/await:
(async function() {
    var db = await pool.acquire();
    var res = db.prepare("select * from users where id = 2").get();
    console.log(res);
    db.release();
})();
*/
