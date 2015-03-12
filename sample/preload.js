'use strict';

var fliprYaml = require('../lib/flipr-yaml');

var source = fliprYaml({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

source.preload(function(){
  console.log('Config file is loaded and cached!');
});