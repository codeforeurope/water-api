//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/product and products', function() {
  afterEach(function() {
    // runs after each test in this block
  });

  /*
   * Test the /GET MineralWater route
   */
  describe('GET', function() {
    it('it should return list of products', function(done) {
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

    /*
   * Test the /POST MineralWater route
   */
  describe('POST', function() {
    it('it should return Error, not Implemented', function(done) {
      chai.request(app)
        .post('/api/product')
        .send({
          name: 'Teusser Naturell',
          observations: [
            {value: 53, uom: "mgl", code: "natrium"},
            {value: 7, uom: "mgl", code: "kalium"},
            {value: 537, uom: "mgl", code: "calcium"},
            {value: 0.5, uom: "mgl", code: "nitrat"},
            {value: 92, uom: "mgl", code: "magnesium"},
            {value: 0.21, uom: "mgl", code: "fluorid"},
            {value: 27, uom: "mgl", code: "chlorid"},
            {value: 1467, uom: "mgl", code: "sulfat"},
            {value: 357, uom: "mgl", code: "hydrogene"}
          ],
          sources: ['http://www.teusser.de/index.php?id=225'],
          vendor: "teusser" //replace with vendor id in the future.
        })
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(400);
          done();
        });
    });
  });
});
