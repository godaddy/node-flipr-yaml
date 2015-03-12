'use strict';

var _ = require('lodash');
var readByFileName = require('./read-by-file-name');
var readByEnvironment = require('./read-by-environment');

module.exports = yamlReader;

function yamlReader(options, cb) {
  if(_.isFunction(options.fileName))
    options.fileName = options.fileName();

  if(_.isString(options.fileName))
    return void readByFileName(options, cb);
  return void readByEnvironment(options, cb);
}