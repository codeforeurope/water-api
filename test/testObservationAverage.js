process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');

it('GET /observation/average should return an array', function(done) {
  request(app).
  get('/api/observations/average').
  expect(200).
  end(function(err, res) {
    var data = JSON.parse(res.text);
    assert.equal(typeof data, "object");
    done();
  });
});
