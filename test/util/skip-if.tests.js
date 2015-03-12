'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sutPath = '../../lib/util/skip-if';
var sut = require(sutPath);

describe('skip-if', function(){
  it('returns function', function(){
    expect(sut()).to.be.a.func;
  });
  describe('returned function', function(){
    it('handles situation where previous waterfall step does not pass a value', function(){
      var skippedSpy = sinon.spy();
      var func = sut(function(){
        return true;
      }, skippedSpy);
      func(function(err, result){
        expect(skippedSpy).to.not.have.been.called;
        expect(err).to.be.undefined;
        expect(result).to.be.undefined;
      });
    });
    it('does not pass result if func is skipped', function(){
      var skippedSpy = sinon.spy();
      var func = sut(function(value){
        return value === 'somevalue';
      }, skippedSpy);
      func('somevalue', function(err, result){
        expect(skippedSpy).to.not.have.been.called;
        expect(err).to.be.undefined;
        expect(result).to.be.undefined;
      });
    });
    it('does not skip if skip condition is false', function(){
      var func = sut(function(value){
        return value === 'somevalue';
      }, function(value, cb){
        expect(value).to.equal('notsomevalue');
        cb(null, 'someothervalue');
      });
      func('notsomevalue', function(err, result){
        expect(err).to.be.null;
        expect(result).to.equal('someothervalue');
      });
    });
  });
});