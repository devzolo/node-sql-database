import { SQLTransaction, SQLResultSet, SQLError } from '../../api';
import { SQLiteResultSet } from './SQLiteResultSet';

export class SQLiteTransaction extends SQLTransaction {
  async commit() {
    await this.impl.t.commit();
  }

  private impl: any;
  private execute: any;

  constructor(impl: any) {
    super();
    this.impl = impl;
    this.execute = this.impl.t.execute;
  }

  private getSqlParameters(source) {
    const result: Array<string> = [];
    const pat = /[@|:].+?([^=\)<>\s\']+|$)/g;
    let mat = pat.exec(source);
    while (mat != null) {
      const param = mat[0];
      const paramName = param.substring(1, mat[0].length);
      if (!(result.indexOf(paramName) > -1)) {
        result.push(paramName);
      }
      mat = pat.exec(source);
    }
    return result;
  }

  async executeSql(
    sql: string,
    args?: any[],
    successCallback?: (transaction: SQLiteTransaction, resultSet: SQLResultSet) => any,
    errorCallback?: (transaction: SQLiteTransaction, error: SQLError) => any,
  ) {
    try {
      if (!args) {
        args = [];
      }
      const params = this.getSqlParameters(sql);
      const obj = {};

      params.forEach((value, index) => {
        console.log(params[index], ' = ', args && args[index]);
        //request.addParameter(params[index], this.impl.sql.TYPES.VarChar, args[index]);
        //request.input(params[index], this.impl.sql.VarChar, args[index]);
        obj[params[index]] = args && args[index];
      });

      const result = await this.impl.t.prepare(sql);
      result.raw(true);
      const rs = new SQLiteResultSet(result);
      try {
        await result.run(obj);
      } catch (e) {
        if (e.name === 'TypeError' && e.message.startsWith('This statement returns data.')) {
        } else throw e;
      }
      if (successCallback) successCallback(this, rs);
    } catch (e) {
      if (errorCallback) errorCallback(this, e);
    }
  }
}
