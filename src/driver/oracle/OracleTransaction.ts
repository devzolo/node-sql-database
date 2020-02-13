import { SQLTransaction, SQLResultSet, SQLError } from '../../api';
import { OracleResultSet } from './OracleResultSet';

export class OracleTransaction extends SQLTransaction {
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

  async executeSql(
    sql: string,
    args?: any[],
    successCallback?: (transaction: OracleTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: OracleTransaction, error: SQLError) => any,
  ) {
    try {
      const result = await this.impl.t.execute(sql, args || []);
      const rs = new OracleResultSet(result);
      if (successCallback) successCallback(this, rs);
    } catch (e) {
      if (errorCallback) errorCallback(this, e);
    }
  }
}
