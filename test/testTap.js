//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/tap', function() {
  afterEach(function() {
    // runs after each test in this block
  });
  /*
   * Test /PUT water
   */
  describe('PUT', function() {
    it('it should return Error, not Implemented', function(done) {
      chai.request(app)
        .put('/api/tap')
        .send({})
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.name, 'Error');
          should.equal(data.message, 'Not Implemented');
          res.should.have.status(400);
          done();
        });
    });
  });
});
