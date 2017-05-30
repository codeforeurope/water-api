//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
require('it-each')({
  testPerIteration: true
});
var fs = require('fs');
var Chance = require('chance');
var chance = new Chance();

chai.use(chaiHttp);
var should = chai.should();

/*
 * Test the /POST Zone route
 */
var token = chance.guid();
var testuser = {
  name: chance.name(),
  email: chance.email(),
  token: token
};
var user = new models.User.model(testuser);

user.save(function(err, user, count) {
  user = user;
});
var limits;

//read zones.geojson
fs.readFile('./test/assets/limits.json', 'utf8', function(err, data) {
  if (err) done(err);
  limits = JSON.parse(data);
  describe('testing /api/limits', function() {
    it.each(limits, 'POST limit, it should return %s', ['name'], function(limit, done) {
      // Do the magic!
      //Try upload
      chai.request(app)
        .post('/api/limit')
        .set('x-access-token', token)
        .send(limit)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          should.equal(data.name, limit.name);
          done();
        });
    });
    it('POST dummy should return new limit', function(done) {
      chai.request(app)
        .post('/api/limit')
        .set('x-access-token', token)
        .send({
          "name": "dummy limit standard",
          "sources": ["http://www.google.com"],
          "limits": [{
            "value": 10,
            "uom": "mg_l",
            "code": "natrium"
          }]
        })
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.name, 'dummy limit standard');
          res.should.have.status(200);
          done();
        });
    });

    it('GET limits should return array of 5 limits', function(done) {
      chai.request(app)
        .get('/api/limits')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          data.should.be.instanceof(Array);
          data.should.have.lengthOf(5);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });

    it('GET limit should return EU limit', function(done) {
      chai.request(app)
        .get('/api/limit')
        .query({
          code: 'EU'
        })
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          data.should.be.instanceof(Array);
          data.should.have.lengthOf(8);
          res.should.have.status(200);
          done();
        });
    });
  });
});
