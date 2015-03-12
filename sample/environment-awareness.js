'use strict';
/**
* Instead of passing an explicit fileName to flipr-yaml, you can configure
* flipr-yaml to pick a configuration file based on your application's environment.
* This is done through the use of an environment variable.  See the example below.
*
* NOTE:  If you do pass options.fileName to flipr-yaml, it will ignore all the environment
* options mentioned below.
*/

var fliprYaml = require('../lib/flipr-yaml');

var source = fliprYaml({
  folderPath: 'sample/config/',
  //Name of environment variable
  envVariable: 'MY_ENV_VARIABLE',
  //Key is the value in envVariable, value is the placeholder
  //passed to util.format when calculating envFileNameFormat.
  envFileNameMap: {
    dev: 'dev',
    test: 'test',
    prod: 'prod'
  },
  //Util.format string for config file name, %s is the value selected from envFileNameMap
  envFileNameFormat: 'config.%s.yaml',
  //If this file exists, it will override the environment-based config file.
  envLocalFileName: 'config.local.yaml'
});

source.getConfig(function(err, config){
  console.dir(config);
});