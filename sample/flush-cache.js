'use strict';

var fliprYaml = require('../lib/flipr-yaml');

var source = fliprYaml({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

source.preload(function(){
  console.log('Config file has been read and cached.  Any changes to the .yaml file will not be read by flipr-yaml.');

  source.flush();

  console.log('Cache has been flushed. The next call to flipr-yaml will result in the file being read and cached again.');
});