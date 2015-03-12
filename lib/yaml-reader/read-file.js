'use strict';

var fs = require('fs');

module.exports = readFile;

function readFile(filePath, cb) {
  fs.readFile(filePath, {encoding: 'utf-8'}, cb);
}