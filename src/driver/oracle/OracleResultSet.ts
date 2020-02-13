import { SQLResultSet } from '../../api';
import { OracleResultSetRowList } from './OracleResultSetRowList';

export class OracleResultSet extends SQLResultSet {
  insertId: number | undefined;
  rowsAffected: number | undefined;
  rows: OracleResultSetRowList;
  columns: any[] | undefined;
  constructor(private rs: any) {
    super();
    this.rows = new OracleResultSetRowList(this.rs);

    if (this.rs.metaData) {
      this.columns = [];
      this.rs.metaData.forEach((value: any, i: number) => {
        this.columns?.push({ index: i + 1, name: value.name });
      });
    }
  }
}
