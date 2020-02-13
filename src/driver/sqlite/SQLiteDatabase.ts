import { Database, SQLTransaction, SQLError } from '../../api';
import { SQLiteTransaction } from '../sqlite';
import { SQLitePool } from './SQLitePool';

export class SQLiteDatabase extends Database {
  /**
        memory: open an in-memory database, rather than a disk-bound one (default: false).
        readonly: open the database connection in readonly mode (default: false).
        fileMustExist: if the database does not exist, an Error will be thrown instead of creating a new file. This option does not affect in-memory or readonly database connections (default: false).
        timeout: the number of milliseconds to wait when executing queries on a locked database, before throwing a SQLITE_BUSY error (default: 5000).
        verbose: provide a function that gets called with every SQL string executed by the database connection (default: null).
    **/
  public setOptions(options: {
    memory?: boolean;
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: boolean;
    verbose?: any;
  }) {
    this.options = options;
  }
  private options: any;
  private config: any = {};
  private sql: any;
  private pool: any = {};
  private connection: any;

  constructor() {
    super();
    this.sql = require('better-sqlite3');
    this.config.options = {};
  }

  async init() {
    this.config.pool = {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    };
    this.pool = new SQLitePool(this.config.database, this.options);
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
      return new Promise<SQLiteDatabase>((resolve, reject) => {
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
    callback: (transaction: SQLTransaction) => any,
    errorCallback?: (error: SQLError) => any,
    successCallback?: () => any,
  ) {
    const connection = this.connection;

    const tx = new SQLiteTransaction({
      sql: this.sql,
      t: connection,
    });

    const txExecutor = connection.transaction(callback);

    try {
      await txExecutor(tx);
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

    const tx = new SQLiteTransaction({
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
