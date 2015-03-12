'use strict';

var _ = require('lodash');
var memoize = require('memoizee');
var yamlReader = require('./yaml-reader/yaml-reader');
var validateConfig = require('./validate-config');

module.exports = FliprYaml;

function FliprYaml(options) {
  //Force instantiation
  if(!(this instanceof FliprYaml))
    return new FliprYaml(options);

  options = _.defaults({}, options, {
    folderPath: 'lib/config',
    envLocalFileName: 'local.yaml',
    envFileNameFormat: '%s.yaml',
    envFileNameMap: {
      dev: 'dev',
      development: 'development',
      test: 'test',
      staging: 'staging',
      master: 'prod',
      prod: 'prod',
      prodution: 'production'
    },
    envVariable: 'NODE_ENV'
  });

  this.getConfig = memoize(_.partial(yamlReader, options), {async:true});

  //Calling getConfig will memoize the cache.
  this.preload = this.getConfig;

  this.flush = _.bind(function(){
    this.getConfig.clear();
  }, this);

  this.validateConfig = _.partial(validateConfig, options);
}