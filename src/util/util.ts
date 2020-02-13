/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
function promisify(func: any) {
  return function(): Promise<void> {
    let args;

    // This/self could refer to the base class instance, pool, connection, etc. All
    // class instances have a private reference to the base class for convenience.
    if (typeof arguments[arguments.length - 1] === 'function') {
      return func.apply(self, arguments);
    } else {
      // Converting to an array so we can extend it later with a custom callback
      args = Array.prototype.slice.call(arguments);

      return new Promise(function(resolve, reject) {
        let errorCode;

        try {
          args[args.length] = function(err: any, result: any): void {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          };

          func.apply(self, args);
        } catch (err) {
          errorCode = err.message.substr(0, 7);

          // Check for invalid number or type of parameter(s) as they should be
          // eagerly thrown.
          if (errorCode === 'NJS-009' || errorCode === 'NJS-006') {
            // Throwing the error outside of the promise wrapper so that its not
            // swallowed up as a rejection.
            process.nextTick(function() {
              throw err;
            });
          } else {
            reject(err);
          }
        }
      });
    }
  };
}

export default promisify;
