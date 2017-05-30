//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
var Chance = require('chance');

chai.use(chaiHttp);
var should = chai.should();
var chance = new Chance();
var uom;
var codes = [];
var user;

describe('testing /observation/average', function() {
  it('GET /observation/average should return an array', function(done) {
    chai.request(app)
      .get('/api/observations/average')
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        res.should.be.json; // jshint ignore:line
        res.should.have.status(200);
        done();
      });
  });
});
