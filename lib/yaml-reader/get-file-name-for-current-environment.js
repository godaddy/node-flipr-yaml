'use strict';

var util = require('util');

module.exports = getFileNameForCurrentEnvironment;

function getFileNameForCurrentEnvironment(options) {
  var envVariable = (process.env[options.envVariable] || '').toLowerCase();
  var environmentFileName = options.envFileNameMap[envVariable];
  if(!environmentFileName)
    throw new Error(
        util.format('Value in process.env.%s not found in options.envFileNameMap. Current value is %s=%s',
          options.envVariable,
          options.envVariable,
          process.env[options.envVariable]));
  return util.format(options.envFileNameFormat, environmentFileName);
}