//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
require('it-each')({ testPerIteration: true });
var fs = require('fs');
chai.use(chaiHttp);
var should = chai.should();

var Chance = require('chance');
var chance = new Chance();
var testproduct_id;
var testproduct_name;

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


/*
 * Test the /POST product route
 */
var products;

//read zones.geojson
fs.readFile('./test/assets/products.json', 'utf8', function (err, data) {
  if (err) done(err);
  products = JSON.parse(data);
  describe('testing /api/product and products', function() {
    it.each(products, 'POST should return %s', ['name'], function(product, done) {
      //Try upload
      chai.request(app)
        .post('/api/product')
        .set('x-access-token', token)
        .send(product)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          testproduct_id = data.id;
          testproduct_name = data.name;
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          should.equal(data.name, product.name);
          done();
        });
    });
    /*
     * Test the /GET MineralWater route
     */
    it('GET Products should return list of products', function(done) {
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

    /*
     * Test the /GET MineralWater route
     */
    it('GET Product should return a product', function(done) {
      chai.request(app)
        .get('/api/product/' + testproduct_id)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          should.equal(data.name, testproduct_name);
          res.should.have.status(200);
          done();
        });
    });
  });
});
