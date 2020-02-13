import { Database, SQLTransaction, SQLError } from '../../api';
import { OracleTransaction } from '../oracle';
import promisify from '../../util/util';

export class OracleDatabase extends Database {
  private config: any = {};
  private sql: any;
  private pool: any = {};
  private connection: any;

  constructor() {
    super();
    this.sql = require('oracledb');

    // return all CLOBs as Strings
    this.sql.fetchAsString = [this.sql.CLOB];

    this.sql.autoCommit = false;
    this.config.options = {};
  }

  async init() {
    this.config.pool = {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    };
    this.pool = await this.sql.createPool(this.config);
  }

  setUser(user) {
    this.config.user = user;
  }

  setPassword(password) {
    this.config.password = password;
  }

  setConnectString(connectString) {
    this.config.connectString = connectString;
  }

  setServer(server) {
    this.config.server = server;
  }

  setDatabase(database) {
    this.config.database = database;
    this.config.options.database = database;
  }

  connect(cb?: any): any {
    if (cb) {
      this.pool.getConnection((err: any, connection: any) => {
        this.connection = connection;
        cb(err, this);
      });
    } else {
      return new Promise<OracleDatabase>((resolve, reject) => {
        this.pool.getConnection((err: any, connection: any) => {
          if (err) {
            reject(err);
          } else {
            this.connection = connection;
            resolve(this);
          }
        });
      });
    }
  }

  async transaction(
    callback: (transaction: SQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ) {
    const connection = this.connection;

    const tx = new OracleTransaction({
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

  async readTransaction(
    callback: (transaction: SQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ) {
    const connection = this.connection;

    const tx = new OracleTransaction({
      sql: this.sql,
      t: connection,
    });

    try {
      await callback(tx);
      if (successCallback) successCallback();
    } catch (e) {
      if (errorCallback) errorCallback(e);
    }
  }
}
