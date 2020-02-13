/* eslint-disable @typescript-eslint/no-explicit-any */
import { SQLResultSet, SQLError } from '.';

export abstract class SQLTransaction {
  /**
   * Executes SQL statement via current transaction.
   * @param sql SQL statement to execute.
   * @param arguments SQL stetement arguments.
   * @param successCallback Called in case of query has been successfully done.
   * @param errorCallback   Called, when query fails. Return false to continue transaction; true or no return to rollback.
   */
  abstract executeSql(
    sql: string,
    args?: any[],
    successCallback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: SQLTransaction, error: SQLError) => any,
  ): void;

  static new(): SQLTransaction | null {
    return null;
  }
}
