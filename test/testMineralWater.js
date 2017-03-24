//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/product', function() {
  afterEach(function() {
    // runs after each test in this block
  });

  /*
   * Test the /GET MineralWater route
   */
  describe('GET', function() {
    it('it should return list of MineralWaters', function(done) {
      chai.request(app)
        .get('/api/products')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          data.should.be.instanceof(Array);
          data.should.have.lengthOf(4);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });

});
