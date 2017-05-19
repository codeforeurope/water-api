//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('tz-business-time');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
var Chance = require('chance');

chai.use(chaiHttp);
var should = chai.should();
var chance = new Chance();

describe('testing /api/company', function() {
  var token = chance.guid();
  var code = chance.string();
  var testcompany = {
    code: code,
    name: chance.word(),
    url: 'http://' + chance.domain(),
    country: chance.country({ full: true })
  };

  var testuser = {
    name: chance.name(),
    email: chance.email(),
    token: token
  };
  var user = new models.User.model(testuser);

  user.save(function (err, user, count) {
    user = user;
  });

  afterEach(function() {
    // runs after each test in this block
  });

  /*
   * Test the /POST Company route
   */
  describe('POST Company', function() {
    it('it should return the newly created company', function(done) {
      chai.request(app)
        .post('/api/company')
        .set('x-access-token', token)
        .send(testcompany)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          should.equal(data.code, code);
          res.should.have.status(200);
          done();
        });
    });
  });
});
