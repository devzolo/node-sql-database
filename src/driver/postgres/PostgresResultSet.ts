import { SQLResultSet } from '../../api';
import { PostgresResultSetRowList } from './PostgresResultSetRowList';

export class PostgresResultSet extends SQLResultSet {
  insertId: number | undefined;
  rowsAffected: number | undefined;
  rows: PostgresResultSetRowList;
  columns: any[] | undefined;
  constructor(private rs: any) {
    super();
    this.rows = new PostgresResultSetRowList(this.rs);

    if (this.rs.fields) {
      this.columns = [];
      this.rs.fields.forEach((value: any, i: number) => {
        this.columns?.push({ index: i + 1, name: value.name });
      });
    }
  }
}
