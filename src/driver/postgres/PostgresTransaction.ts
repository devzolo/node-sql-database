import { SQLTransaction, SQLResultSet, SQLError } from '../../api';
import { PostgresResultSet } from './PostgresResultSet';

export class PostgresTransaction extends SQLTransaction {
  async begin() {
    await this.impl.t.query('BEGIN');
  }

  async commit() {
    await this.impl.t.query('COMMIT');
  }

  async rollback() {
    await this.impl.t.query('ROLLBACK');
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
    successCallback?: (transaction: PostgresTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: PostgresTransaction, error: SQLError) => any,
  ) {
    try {
      if (!args) {
        args = [];
      }

      const params = this.getSqlParameters(sql);

      params.forEach((value, index) => {
        console.log(params[index], ' = ', args && args[index]);
        //request.addParameter(params[index], this.impl.sql.TYPES.VarChar, args[index]);
        //request.input(params[index], this.impl.sql.VarChar, args[index]);
      });

      //let result = await this.impl.t.query(sql, args || []);

      const result = await this.impl.t.query({
        text: sql,
        values: args || [],
        rowMode: 'array',
      });

      //console.log(result);

      const rs = new PostgresResultSet(result);
      if (successCallback) successCallback(this, rs);
    } catch (e) {
      if (errorCallback) errorCallback(this, e);
    }
  }
}
