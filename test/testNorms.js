process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

var testdata = require('../assets/norms.json');

describe('inserting norms', function() {
  var token;

  before(function(done) {
    var Chance = require('chance');
    var chance = new Chance();
    token = chance.guid();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: token
    };
    var user = new models.User.model(testuser);
    user.save(function(err, user, count) {
      if (err) done(err);
      done();
    });
  });
  testdata.forEach(function(instance) {
    it('should return ' + instance.name, function(done) {
      request(app).
      post('/api/norm').
      set('x-access-token', token).
      send(instance).
      expect(200).
      end(function(err, res) {
        if (err) done(err);
        var data = JSON.parse(res.text);
        assert.equal(data.name, instance.name);
        done();
      });
    });
  });
});
