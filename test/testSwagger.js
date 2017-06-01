//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var request = require('supertest');
var assert = require('assert');
var app = require('../server');

describe('testing /docs', function() {

  it('GET swagger UI should GET default swagger docs', function(done) {
    request(app)
      .get('/docs')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        done();
      });
  });

});
