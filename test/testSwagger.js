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

  it('GET swagger UI should GET default swagger docs', function(done) {
    chai.request(app)
      .get('/docs')
      .end(function(err, res) {
        res.should.be.html; // jshint ignore:line
        res.should.have.status(200);
        done();
      });
  });

});
