/* eslint-disable @typescript-eslint/no-empty-function */
import { SQLTransaction, SQLResultSet, SQLError } from '../../api';
import { MSSQLResultSet } from './MSSQLResultSet';

export class MSSQLTransaction extends SQLTransaction {
  async commit() {}

  constructor(private impl: any) {
    super();
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
    successCallback?: (transaction: MSSQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: MSSQLTransaction, error: SQLError) => any,
  ) {
    const request = new this.impl.sql.Request(this.impl.t);

    try {
      if (!args) {
        args = [];
      }
      const params = this.getSqlParameters(sql);
      params.forEach((value, index) => {
        console.log(params[index], ' = ', args && args[index]);
        //request.addParameter(params[index], this.impl.sql.TYPES.VarChar, args[index]);
        request.input(params[index], this.impl.sql.VarChar, args && args[index]);
      });

      const result = await request.query(sql);

      if (successCallback) {
        const rs = new MSSQLResultSet(result);
        if (successCallback) successCallback(this, rs);
      }
    } catch (e) {
      if (errorCallback) errorCallback(this, e);
    }
  }
}
