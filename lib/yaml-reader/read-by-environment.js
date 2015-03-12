'use strict';

var path = require('path');
var _ = require('lodash');
var async = _.extend(require('async'), require('async-ext'));
var yaml = require('js-yaml');
var skipIf = require('../util/skip-if');
var endIf = require('../util/end-if');
var endWaterfall = require('../util/end-waterfall');
var getFileNameForCurrentEnvironment = require('./get-file-name-for-current-environment');
var readFileWithoutError = require('./read-file-without-error');
var readFile = require('./read-file');

module.exports = readByEnvironment;

function readByEnvironment(options, cb) {
  async.waterfall([
    async.lift(_.partial(path.resolve, options.folderPath, options.envLocalFileName)),
    readFileWithoutError,
    skipIf(isNoFileData, 
      endIf(async.lift(yaml.safeLoad), _.isObject)),
    async.lift(_.partial(getFileNameForCurrentEnvironment, options)),
    async.lift(_.partial(path.resolve, options.folderPath)),
    readFile,
    async.lift(yaml.safeLoad)
  ], endWaterfall(cb));
}

function isNoFileData(value) {
  return !_.isString(value) || value.trim() === '';
}