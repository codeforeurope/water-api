process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

it('PUT Location without token should return AuthenticationError, No token provided', function(done) {
  request(app).
  put('/api/location').
  send({}).
  expect(402).
  end(function(err, res) {
    var data = JSON.parse(res.text);
    assert.equal(data.name, 'AuthenticationError');
    assert.equal(data.message, 'No token provided');
    done();
  });
});
