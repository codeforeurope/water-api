//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/pumping station ', function() {
  afterEach(function() {
    // runs after each test in this block
  });

  /*
   * Test the /GET Pumping Stations route
   */
  describe('GET', function() {
    it('it should return list of pumpingstations', function(done) {
      chai.request(app)
        .get('/api/pumpingstations')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.name, 'Error');
          should.equal(data.message, 'Not Implemented');
          res.should.have.status(400);
          done();
        });
    });
  });

    /*
   * Test the /GET Pumping Station route
   */
  describe('GET', function() {
    it('it should return a valid response', function(done) {
      chai.request(app)
        .get('/api/pumpingstation')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });
});
