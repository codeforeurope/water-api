//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');

chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/limits', function() {
  describe('GET limits', function() {
    it('it should return array with US and EU limits', function(done) {
      chai.request(app)
        .get('/api/limits')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          data.should.be.instanceof(Array);
          data.should.have.lengthOf(2);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('GET limit', function() {
    it('it should return EU limit', function(done) {
      chai.request(app)
        .get('/api/limit')
        .query({code: 'EU'})
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          should.equal(data.name, 'EU');
          res.should.have.status(200);
          done();
        });
    });
  });
});
