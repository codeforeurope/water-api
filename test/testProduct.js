process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

var testdata = require('../assets/products.json');

describe('inserting products', function() {
  var token;
  var user;

  before(function(done) {
    var Chance = require('chance');
    var chance = new Chance();
    token = chance.guid();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: token
    };
    new models.User.model(testuser).save(function(err, result, count) {
      user = result;
      done();
    });
  });
  testdata.forEach(function(instance) {
    it('should return ' + instance.name, function(done) {
      request(app).
      post('/api/product').
      set('x-access-token', token).
      send(instance).
      expect(200).
      end(function(err, res) {
        var data = JSON.parse(res.text);
        assert.equal(data.name, instance.name);
        done();
      });
    });
  });
});
