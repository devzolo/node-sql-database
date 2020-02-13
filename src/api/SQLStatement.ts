/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class SQLStatement {
  constructor(strings: any, values: any) {}
}

export function SQL(strings: string): SQLStatement {
  // eslint-disable-next-line prefer-rest-params
  return new SQLStatement(strings.slice(0), Array.from(arguments).slice(1));
}
