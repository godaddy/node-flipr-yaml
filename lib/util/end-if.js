'use strict';

module.exports = endIf;

function endIf(func, condition) {
  return function(value, cb) {
    func(value, function(err, result){
      if(err)
        return void cb(err);
      if(condition(result))
        return void cb(true, result);
      cb(null, result);
    });
  };
}