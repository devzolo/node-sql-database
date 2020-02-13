/* eslint-disable @typescript-eslint/no-explicit-any */
import { SQLResultSetRowList } from '.';

export abstract class SQLResultSet {
  insertId: number | undefined;
  rowsAffected: number | undefined;
  rows: SQLResultSetRowList | undefined;
  columns: any[] | undefined;
}
