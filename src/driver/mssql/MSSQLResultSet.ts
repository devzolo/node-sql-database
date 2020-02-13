import { SQLResultSet } from '../../api';
import { MSSQLResultSetRowList } from './MSSQLResultSetRowList';

export class MSSQLResultSet extends SQLResultSet {
  insertId: number | undefined;
  rowsAffected: number | undefined;
  rows: MSSQLResultSetRowList;
  columns: any[] | undefined;
  constructor(private rs: any) {
    super();
    this.rows = new MSSQLResultSetRowList(this.rs);
    if (this.rs.recordset.columns) {
      this.columns = [];
      if (rs.recordset.columns) {
        let value: any = null;
        for (const key in rs.recordset.columns) {
          value = rs.recordset.columns[key];
          this.columns.push({ index: value.index, name: value.name });
        }
      }
    }
  }
}
