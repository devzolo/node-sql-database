export class SQLError {
  // Error code constants from http://www.w3.org/TR/webdatabase/#sqlerror
  static UNKNOWN_ERR = 0;
  static DATABASE_ERR = 1;
  static VERSION_ERR = 2;
  static TOO_LARGE_ERR = 3;
  static QUOTA_ERR = 4;
  static SYNTAX_ERR = 5;
  static CONSTRAINT_ERR = 6;
  static TIMEOUT_ERR = 7;

  code: number | undefined;
  message: string | undefined;
}
