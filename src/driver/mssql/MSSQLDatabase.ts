import { Database, SQLTransaction, SQLError } from '../../api';
import { MSSQLTransaction } from './MSSQLTransaction';

//https://tediousjs.github.io/node-mssql/#connection-pools
export class MSSQLDatabase extends Database {
  private config: any = {};
  private sql: any;
  private pool: any = {};
  private connection: any;

  //connect
  constructor() {
    super();
    this.sql = require('mssql');
    this.config.options = {};
  }

  init() {
    this.config.pool = {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    };
    this.pool = new this.sql.ConnectionPool(this.config);
  }

  setUser(user) {
    this.config.user = user;
  }

  setPassword(password) {
    this.config.password = password;
  }

  setServer(server) {
    this.config.server = server;
  }

  setDatabase(database) {
    this.config.database = database;
    this.config.options.database = database;
  }

  connect(cb?: any): Promise<MSSQLDatabase> | void {
    if (cb) {
      this.pool.connect((err: any) => {
        this.connection = this.pool;
        cb(err, this);
      });
    } else {
      return new Promise<any>((resolve, reject) => {
        this.pool.connect((err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        });
      });
    }
  }

  async transaction(
    callback: (transaction: MSSQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ) {
    const connection = this.connection;

    const tx = new MSSQLTransaction({
      sql: this.sql,
      t: connection,
    });

    await callback(tx);

    try {
      await tx.commit();
      if (successCallback) successCallback();
    } catch (e) {
      if (errorCallback) errorCallback(e);
    }

    /*
        let txImpl = new this.sql.Transaction(connection);
        await txImpl.begin(async (err) => {
            if(err) {
                if(errorCallback)errorCallback(err);
                return;
            }

            await callback(new MSSQLTransaction({
                sql: this.sql,
                t:txImpl
            }));

            txImpl.commit(err => {
                if(err) {
                    if(errorCallback)
                        errorCallback(err);
                }
                else {
                    if(successCallback)
                        successCallback();
                }
            });
        });
        */
  }

  async readTransaction(
    callback: (transaction: SQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ) {
    const connection = this.connection;

    const tx = new MSSQLTransaction({
      sql: this.sql,
      t: connection,
    });

    await callback(tx);

    try {
      await tx.commit();
      if (successCallback) successCallback();
    } catch (e) {
      if (errorCallback) errorCallback(e);
    }
  }
}
