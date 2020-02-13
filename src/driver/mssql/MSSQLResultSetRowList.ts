import { SQLResultSetRowList } from '../../api';
import { MSSQLResultSetRow } from './MSSQLResultSetRow';

export class MSSQLResultSetRowList extends SQLResultSetRowList {
  private pointer = 0;
  private columns: any;
  private rows: any;

  constructor(rs: any) {
    super();
    this.rows = rs.recordset || [];
    this.length = this.rows.length;

    if (rs.recordset.columns) {
      this.columns = {};
      const index = 0;
      let value: any = null;
      for (const key in rs.recordset.columns) {
        value = rs.recordset.columns[key];
        this.columns[value.name.toLowerCase()] = key;
      }
    }
  }

  item(index: number): any {
    return this.rows[index];
  }

  next(value?: any): IteratorResult<any> {
    if (this.pointer < this.rows.length) {
      return {
        done: false,
        value: new MSSQLResultSetRow(this.rows[this.pointer++], this.columns),
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }
}
