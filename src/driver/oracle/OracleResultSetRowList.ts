import { SQLResultSetRowList } from '../../api';
//import { print } from "util";
import { OracleResultSetRow } from './OracleResultSetRow';

export class OracleResultSetRowList extends SQLResultSetRowList {
  private pointer = 0;
  private columns: any;
  private rows: any;

  constructor(rs: any) {
    super();
    this.rows = rs.rows || [];
    this.length = this.rows.length;

    if (rs.metaData) {
      this.columns = {};
      rs.metaData.forEach((value: any, index: number) => {
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
        value: new OracleResultSetRow(this.rows[this.pointer++], this.columns),
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }

  //return?(value?: any): IteratorResult<any>;
  //throw?(e?: any): IteratorResult<any>;

  /*
    [Symbol.iterator]() {
        let pointer = 0;
        let rows = this.rs.rows;
        return {
            next(): IteratorResult<any> {
                if (pointer < rows.length) {
                    return {
                        done: false,
                        value: rows[pointer++]
                    };
                } else {
                    return {
                        done: true,
                        value: null
                    };
                }
            }
        };
    }
    */
}
