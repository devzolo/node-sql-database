/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class SQLResultSetRowList implements IterableIterator<any> {
  public length!: number;
  abstract item(index: number): any;

  [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  abstract next(value?: any): IteratorResult<any>;
  //abstract return?(value?: any): IteratorResult<any>;
  //abstract throw?(e?: any): IteratorResult<any>;
}

/*

point.prototype.__add = function(left){
    //overload operator
  }
  point.prototype.__assign = function(left){
    //overload operator
  }
  point.prototype.__get = function(key){
    //overload array op
  }
  point.prototype.__set = function(key, value){
    //overload array op
  }

  */
