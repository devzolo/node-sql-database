export class MSSQLResultSetRow {
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
}
