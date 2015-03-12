'use strict';

var fs = require('fs');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var Sut = require('../lib/flipr-yaml');
var options;

describe('flipr-yaml', function(){
  beforeEach(function(){
    options = {
      folderPath: path.resolve(__dirname, 'fixtures'),
      envFileNameFormat: 'config.%s.yaml'
    };
    process.env.NODE_ENV = 'dev';
  });
  it('will return instance without using new', function(){
    var sut = Sut(); // jshint ignore:line
    expect(sut).to.be.instanceof(Sut);
  });
  it('exposes the interface required by flipr sources', function(){
    var sut = new Sut();
    expect(sut.getConfig).to.be.a.func;
    expect(sut.preload).to.be.a.func;
    expect(sut.flush).to.be.a.func;
    expect(sut.validateConfig).to.be.a.func;
  });
  it('overrides env options when fileName is provided', function(done){
    options.fileName = 'config.noenv.yaml';
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      expect(config.someKey.value).to.equal('noenv');
      done();
    });
  });
  it('accepts a function for fileName', function(done){
    options.fileName = function(){return 'config.noenv.yaml';};
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      expect(config.someKey.value).to.equal('noenv');
      done();
    });
  });
  it('picks envLocalFileName if the file exists', function(done){
    options.envLocalFileName = 'config.local.yaml';
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      expect(config.someKey.value).to.equal('local');
      done();
    });
  });
  it('picks file matching envFileNameFormat if envLocalFileName file does not exist', function(done){
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      expect(config.someKey.value).to.equal('dev');
      done();
    });
  });
  it('allows you to override the envVariable', function(done){
    process.env.NOT_NODE_ENV = 'test';
    options.envVariable = 'NOT_NODE_ENV';
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      expect(config.someKey.value).to.equal('test');
      done();
    });
  });
  it('memoizes the config', function(done){
    generateRandomYaml();
    options.fileName = 'config.random.yaml';
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      var firstValue = config.someKey.value;
      generateRandomYaml();
      sut.getConfig(function(err2, config2){
        if(err2) return void done(err2);
        expect(config2.someKey.value).to.equal(firstValue);
        done();
      });
    });
  });
  it('flushes the memoized config', function(done){
    generateRandomYaml();
    options.fileName = 'config.random.yaml';
    var sut = new Sut(options);
    sut.getConfig(function(err, config){
      if(err) return void done(err);
      var firstValue = config.someKey.value;
      generateRandomYaml();
      sut.flush();
      sut.getConfig(function(err2, config2){
        if(err2) return void done(err2);
        expect(config2.someKey.value).to.not.equal(firstValue);
        done();
      });
    });
  });
  it('does not allow a bad config to pass validation', function(done){
    options.fileName = 'config.invalid.yaml';
    options.rules = [{type: 'percent', input: 'id'}];
    var sut = new Sut(options);
    sut.validateConfig(function(err, errors){
      if(err) return void done(err);
      expect(errors.length).to.equal(3);
      done();
    });
  });
  it('preloads config by retrieving the config', function(done){
    var sut = new Sut(options);
    sut.preload(function(err, config){
      if(err) return void done(err);
      expect(config.someKey.value).to.equal('dev');
      done();
    });
  });
  it('sends error to cb if value of the env variable specified by envVariable is not in envFileNameMap', function(done){
    process.env.NODE_ENV = 'BOOM';
    var sut = new Sut(options);
    sut.getConfig(function(err){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
  it('sends error to cb if env variable is empty', function(done){
    delete process.env.NODE_ENV;
    var sut = new Sut(options);
    sut.getConfig(function(err){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
  it('sends error to cb if validateConfig encounters an error', function(done){
    delete process.env.NODE_ENV;
    var sut = new Sut(options);
    sut.validateConfig(function(err){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});

function generateRandomYaml(){
  var yamlString = '---\nsomeKey:\n  value: ' + Math.random();
  fs.writeFileSync(path.resolve(__dirname,'fixtures/config.random.yaml'), yamlString); 
}