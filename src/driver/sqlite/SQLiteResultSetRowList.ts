import { SQLResultSetRowList } from '../../api';
import { SQLiteResultSetRow } from './SQLiteResultSetRow';

export class SQLiteResultSetRowList extends SQLResultSetRowList {
  private pointer = 0;
  private columns: any;
  private rows: any;
  private rs: any;

  constructor(rs: any) {
    super();
    this.rs = rs;
    this.rows = rs.all() || [];
    this.length = this.rows.length;

    if (rs.columns()) {
      this.columns = {};
      rs.columns().forEach((value: any, index: number) => {
        this.columns[value.name.toLowerCase()] = index;
      });
    }
  }

  item(index: number): any {
    return this.rows[index];
  }

  next(value?: any): IteratorResult<any> {
    if (this.pointer < this.rows.length) {
      //console.log(this.rows[this.pointer++]);
      return {
        done: false,
        value: new SQLiteResultSetRow(this.rows[this.pointer++], this.columns),
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }
}
