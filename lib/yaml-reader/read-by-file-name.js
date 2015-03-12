'use strict';

var path = require('path');
var _ = require('lodash');
var async = _.extend(require('async'), require('async-ext'));
var readFile = require('./read-file');
var yaml = require('js-yaml');

module.exports = readByFileName;

function readByFileName(options, cb) {
  async.waterfall([
    async.lift(_.partial(path.resolve, options.folderPath, options.fileName)),
    readFile,
    async.lift(yaml.safeLoad)
  ], cb);
}