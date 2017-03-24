//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
chai.use(chaiHttp);
var should = chai.should();

describe('testing /docs', function() {
  afterEach(function() {
    // runs after each test in this block
  });
  /*
   * Test the /GET docs route
   */
  describe('GET', function() {
    it('it should GET default swaggger docs', function(done) {
      chai.request(app)
        .get('/docs')
        .end(function(err, res) {
          res.should.be.html; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });
});
