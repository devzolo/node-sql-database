/* eslint-disable @typescript-eslint/no-unused-vars */
import { SQLTransaction, SQLError } from '.';

export abstract class Database {
  /**
   * Starts new transaction.
   * @param callback        Function, that will be called when transaction starts.
   * @param errorCallback   Called, when Transaction fails.
   * @param successCallback Called, when transaction committed.
   */
  abstract transaction(
    callback: (transaction: SQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ): void;
  /**
   * Starts new transaction.
   * @param callback        Function, that will be called when transaction starts.
   * @param errorCallback   Called, when Transaction fails.
   * @param successCallback Called, when transaction committed.
   */
  abstract readTransaction(
    callback: (transaction: SQLTransaction) => void,
    errorCallback?: (error: SQLError) => void,
    successCallback?: () => void,
  ): void;

  name: string | undefined;

  version: string | undefined;

  displayName: string | undefined;

  size: number | undefined;

  /**
   * Creates (opens, if exist) database with supplied parameters.
   * @param  name        Database name
   * @param  version     Database version
   * @param  displayname Database display name
   * @param  size        Size, in bytes
   * @param  creationCallback Callback, that executed on database creation. Accepts Database object.
   */
  static new(
    name: string,
    version: string,
    displayname: string,
    size: number,
    creationCallback: (database: Database) => void,
  ): Database | null {
    return null;
  }
}
