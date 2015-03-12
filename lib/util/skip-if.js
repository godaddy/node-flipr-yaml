'use strict';

module.exports = skipIf;

function skipIf(condition, func) {
  return function(value, cb) {
    //This is required in the case
    //when the previous step in the 
    //waterfall does not pass a value.
    if(arguments.length === 1) {
      cb = value;
      value = void(0);
    }
    if(condition(value))
      return cb();
    return func(value, cb);
  };
}