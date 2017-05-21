//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');

chai.use(chaiHttp);
var should = chai.should();

describe('testing inserting observation codes', function() {
  describe('Natrium', function() {
    it('it should be Natrium', function(done) {
      var natrium = models.Code.model({
        code: 'natrium',
        standard: 'CAS',
        value: '7440-23-5',
        label: {en:'Sodium', de: 'Natrium', nl: 'Natrium'}
      });
      natrium.save();
      var out = natrium.toJSONLocalizedOnly('de', 'en');
      should.equal(out.label, 'Natrium');
      done();
    });
  });

  describe('Nitrate', function() {
    it('it should be Nitrate', function(done) {
      var nitrate = models.Code.model({
        code: 'nitrate',
        standard: 'CAS',
        value: '14797-55-8',
        label: {en:'Nitrate', de: 'Nitrat', nl: 'Nitraat'}
      });
      nitrate.save();
      var out = nitrate.toJSONLocalizedOnly('de', 'en');
      should.equal(out.label, 'Nitrat');
      done();
    });
  });

  describe('Calcium', function() {
    it('it should be Calcium', function(done) {
      var calcium = models.Code.model({
        code: 'calcium',
        standard: 'CAS',
        value: '7440-70-2',
        label: {
          en: 'Calcium'
        }
      });
      calcium.save();
      var out = calcium.toJSONLocalizedOnly('nl', 'en');
      should.equal(out.label, 'Calcium');
      done();
    });
  });
  describe('Potassium', function() {
    it('it should be Potassium', function(done) {
      var potassium = models.Code.model({
        code: 'kalium',
        standard: 'CAS',
        value: '7440-09-7',
        label: {
          en: 'Potassium',
          nl: 'Kalium',
          de: 'Kalium'
        }
      });
      potassium.save();
      var out = potassium.toJSONLocalizedOnly('fr', 'en');
      should.equal(out.label, 'Potassium');
      done();
    });
  });

  describe('Magnesium', function() {
    it('it should be Potassium', function(done) {
      var test = models.Code.model({
        code: 'magnesium',
        standard: 'CAS',
        value: '7439-95-4',
        label: {
          en: 'Magnesium'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('fr', 'en');
        should.equal(out.label, 'Magnesium');
        done();
      });
    });
  });

  describe('Fluoride', function() {
    it('it should be Fluorid', function(done) {
      var test = models.Code.model({
        code: 'fluoride',
        standard: 'CAS',
        value: '16984-48-8',
        label: {
          en: 'Fluoride',
          de: 'Fluorid'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('de', 'en');
        should.equal(out.label, 'Fluorid');
        done();
      });
    });
  });

  describe('Chloride', function() {
    it('it should be Chlorid', function(done) {
      var test = models.Code.model({
        code: 'chloride',
        standard: 'CAS',
        value: '16887-00-6',
        label: {
          en: 'Chloride',
          de: 'Chlorid'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('de', 'en');
        should.equal(out.label, 'Chlorid');
        done();
      });
    });
  });

  describe('Sulfate', function() {
    it('it should be Sulfaat', function(done) {
      var test = models.Code.model({
        code: 'sulfate',
        standard: 'CAS',
        value: '14808-79-8',
        label: {
          en: 'Sulfate',
          de: 'Sulfat',
          nl: 'Sulfaat'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('nl', 'en');
        should.equal(out.label, 'Sulfaat');
        done();
      });
    });
  });

  describe('Hydrogen', function() {
    it('it should be Hydrogeen', function(done) {
      var test = models.Code.model({
        code: 'hydrogen',
        standard: 'CAS',
        value: '1333-74-0',
        label: {
          en: 'Hydrogen',
          de: 'Hydrogene',
          nl: 'Hydrogeen'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('nl', 'en');
        should.equal(out.label, 'Hydrogeen');
        done();
      });
    });
  });

  describe('Microbacteria', function() {
    it('it should be Microbacteria', function(done) {
      var test = models.Code.model({
        code: 'mycobacteria',
        standard: 'NA',
        value: 'mycobacteria',
        label: {
          en: 'Mycobacteria',
          nl: 'Microbacteriën',
          de: 'Microbacteria'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('nl', 'en');
        should.equal(out.label, 'Microbacteriën');
        done();
      });
    });
  });

  describe('Bicarbonate (HC03)', function() {
    it('it should be Bicarbonate (HC03)', function(done) {
      var test = models.Code.model({
        code: 'bicarbonate',
        standard: 'NA',
        value: 'bicarbonate',
        label: {
          en: 'Bicarbonate (HC03)'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('nl', 'en');
        should.equal(out.label, 'Bicarbonate (HC03)');
        done();
      });
    });
  });

  describe('Silicate', function() {
    it('it should be Silicate', function(done) {
      var test = models.Code.model({
        code: 'silicate',
        standard: 'CAS',
        value: '3163-01-7',
        label: {
          en: 'Silicate'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('nl', 'en');
        should.equal(out.label, 'Silicate');
        done();
      });
    });
  });

  describe('Trihalomethanes (THMS)', function() {
    it('it should be Trihalomethanes (THMS)', function(done) {
      var test = models.Code.model({
        code: 'trihalomethanes',
        standard: 'NA',
        value: 'trihalomethanes',
        label: {
          en: 'Trihalomethanes (THMS)'
        }
      });
      test.save(function(err, test, count){
        var out = test.toJSONLocalizedOnly('nl', 'en');
        should.equal(out.label, 'Trihalomethanes (THMS)');
        done();
      });
    });
  });
});
