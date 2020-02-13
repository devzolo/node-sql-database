import { SQLResultSetRowList } from '../../api';
//import { print } from "util";
import { PostgresResultSetRow } from './PostgresResultSetRow';

export class PostgresResultSetRowList extends SQLResultSetRowList {
  private pointer = 0;
  private columns: any;
  private rows: any;

  constructor(rs: any) {
    super();
    this.rows = rs.rows || [];
    this.length = this.rows.length;

    if (rs.fields) {
      this.columns = {};
      rs.fields.forEach((value: any, index: number) => {
        this.columns[value.name.toLowerCase()] = index;
      });
    }
  }

  item(index: number): any {
    return this.rows[index];
  }

  next(value?: any): IteratorResult<any> {
    if (this.pointer < this.rows.length) {
      return {
        done: false,
        value: new PostgresResultSetRow(this.rows[this.pointer++], this.columns),
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }
}
