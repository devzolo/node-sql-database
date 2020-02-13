/* eslint-disable @typescript-eslint/camelcase */
import { Database, SQLTransaction, SQLError } from '../../api';
import { PostgresTransaction } from '../postgres';

export class PostgresDatabase extends Database {
  private config: any = {};
  private sql: any;
  private pool: any = {};
  private connection: any;

  constructor() {
    super();
    this.sql = require('pg');

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
    this.pool = new this.sql.Pool(this.config);
    this.pool.on('connect', client => {
      if (this.config.search_path) {
        client.query(`SET search_path TO ${this.config.search_path}, public`);
      }
    });
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
    this.config.host = server;
  }

  setDatabase(database) {
    this.config.database = database;
    this.config.options.database = database;
  }

  setSchema(schema: string) {
    this.config.search_path = schema;
  }

  connect(cb?: any): any {
    if (cb) {
      this.pool.connect((err: any, connection: any) => {
        this.connection = connection;
        cb(err, this);
      });
    } else {
      return new Promise<PostgresDatabase>((resolve, reject) => {
        this.pool.connect((err: any, connection: any) => {
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

    const tx = new PostgresTransaction({
      sql: this.sql,
      t: connection,
    });

    try {
      await tx.begin();
      await callback(tx);
      await tx.commit();
      if (successCallback) successCallback();
    } catch (e) {
      await tx.rollback();
      if (errorCallback) errorCallback(e);
    }

    /*
        try {
            await client.query('BEGIN')
            const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
            const { rows } = await client.query(queryText, ['brianc'])
            const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
            const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
            await client.query(insertPhotoText, insertPhotoValues)
            await client.query('COMMIT')
          } catch (e) {
            await client.query('ROLLBACK')
            throw e
          } finally {
            client.release()
          }
        */

    /*
        connection.query('COMMIT', (err: any) => {
            if (err) {
                if(errorCallback)
                    errorCallback(err);
                return;
            }
            if(successCallback)
                successCallback();
        });
        */
  }

  async readTransaction(
    callback: (transaction: SQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ) {
    const connection = this.connection;

    const tx = new PostgresTransaction({
      sql: this.sql,
      t: connection,
    });

    try {
      await callback(tx);
      if (successCallback) successCallback();
    } catch (e) {
      if (errorCallback) errorCallback(e);
    }

    /*
        try {
            await callback(tx);
            if(successCallback)
                successCallback();
        }
        catch(e) {
            if(errorCallback)
                errorCallback(e);
        }
        */
  }
}
