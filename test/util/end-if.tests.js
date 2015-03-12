'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/end-if';
var sut = require(sutPath);

describe('end-if', function(){
  it('returns function', function(){
    expect(sut()).to.be.a.func;
  });
  describe('returned function', function(){
    it('sends error to cb', function(){
      var func = sut(function(value, cb){
        cb('someerror');
      });
      func('someresult', function(err){
        expect(err).to.equal('someerror');
      });
    });
    it('returns true and result if condition is true', function(){
      var func = sut(function(value, cb){
        cb(null, value);
      }, function(){return true;});
      func('someresult', function(endReason, result){
        expect(endReason).to.be.true;
        expect(result).to.equal('someresult');
      });
    });
    it('returns null and result if condition is false', function(){
      var func = sut(function(value, cb){
        cb(null, value);
      }, function(){return false;});
      func('someresult', function(endReason, result){
        expect(endReason).to.be.null;
        expect(result).to.equal('someresult');
      });
    });
  });
});