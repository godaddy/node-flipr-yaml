'use strict';

var FliprYaml = require('../lib/flipr-yaml');

var source = new FliprYaml({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

source.getConfig(function(err, config){
  console.dir(config);
});