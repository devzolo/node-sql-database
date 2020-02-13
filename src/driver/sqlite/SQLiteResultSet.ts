import { SQLResultSet } from '../../api';
import { SQLiteResultSetRowList } from './SQLiteResultSetRowList';

export class SQLiteResultSet extends SQLResultSet {
  insertId: number | undefined;
  rowsAffected: number | undefined;
  rows: SQLiteResultSetRowList;
  columns: any[] | undefined;
  constructor(private rs: any) {
    super();
    this.rows = new SQLiteResultSetRowList(this.rs);
    if (this.rs.metaData) {
      this.columns = [];
      this.rs.columns().forEach((value: any, i: number) => {
        this.columns?.push({ index: i + 1, name: value.name });
      });
    }
  }
}
