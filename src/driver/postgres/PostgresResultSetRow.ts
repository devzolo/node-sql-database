export class PostgresResultSetRow {
  private index: any = 0;

  constructor(private row: any, private columns: any) {
    return new Proxy({}, this);
  }

  get(_target: any, column: any) {
    if (isNaN(column)) {
      this.index = this.columns[column.toLowerCase()];
      return this.row[this.index];
    }
    return this.row[column];
  }

  /*
    get(_target: any, column: any) {
        if(isNaN(column)) {
            //console.dir(this.columns)
            //this.index = this.columns[column.toLowerCase()];
            //return this.row[this.index];
            return this.row[column];
        }
        //{ id: 0, name: 1, age: 2, address: 3, salary: 4 }
        //return this.row[column];
        return undefined;
    }
    */
}
