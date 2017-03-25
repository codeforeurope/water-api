//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/company', function() {
  afterEach(function() {
    // runs after each test in this block
  });

    /*
   * Test the /POST Company route
   */
  describe('POST', function() {
    it('it should return the newly created company', function(done) {
      chai.request(app)
        .post('/api/company')
        .send({
            code: 'wueteria',
            name: 'Wüteria Mineralquellen GmbH & Co. KG',
            url: 'http://wueteria.de',
            country: 'Germany'
        })
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          should.equal(data.code, 'wueteria');
          res.should.have.status(200);
          done();
        });
    });
  });
});
