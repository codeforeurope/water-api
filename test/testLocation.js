process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');
describe('inserting locations', function() {
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

  it('should post Plants', function(done) {
    request(app).
    post('/api/locations').
    set('x-access-token', token).
    attach('file', './assets/plants.json').
    expect(200).
    end(function(err, res) {
      if (err) done(err);
      var data = JSON.parse(res.text);
      assert.equal(data.locations.length, 173);
      done();
    });
  });

  it('should post Taps', function(done) {
    request(app).
    post('/api/locations').
    set('x-access-token', token).
    attach('file', './assets/taps.json').
    expect(200).
    end(function(err, res) {
      if (err) done(err);
      var data = JSON.parse(res.text);
      assert.equal(data.locations.length, 655);
      done();
    });
  });

  it('PUT Location without token should return AuthenticationError, No token provided', function(done) {
    request(app).
    put('/api/location').
    send({}).
    expect(402).
    end(function(err, res) {
      if (err) done(err);
      var data = JSON.parse(res.text);
      assert.equal(data.name, 'AuthenticationError');
      assert.equal(data.message, 'No token provided');
      done();
    });
  });
});
