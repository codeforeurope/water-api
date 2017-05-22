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

var Chance = require('chance');
var chance = new Chance();

describe('testing /api/product and products', function() {
  var token = chance.guid();
  var testuser = {
    name: chance.name(),
    email: chance.email(),
    token: token
  };
  var user = new models.User.model(testuser);

  user.save(function (err, user, count) {
    user = user;
  });

  var volvic_50cl = {
    name: 'Volvic 50 cl',
    volume: 0.5,
    observations: [
      {value: 11.6, uom: "mg_l", code: "natrium"},
      {value: 71, uom: "mg_l", code: "bicarbonate"},
      {value: 31.7, uom: "mg_l", code: "silica"},
      {value: 11.7, uom: "mg_l", code: "kalium"},
      {value: 11.5, uom: "mg_l", code: "calcium"},
      {value: 8, uom: "mg_l", code: "magnesium"},
      {value: 13.5, uom: "mg_l", code: "chloride"},
      {value: 8.1, uom: "mg_l", code: "sulfate"},
      {value: 6.3, uom: "mg_l", code: "nitrate"}
    ],
    sources: ['https://world.openfoodfacts.org/product/3057640117008/volvic'],
    vendor: "volvic"
  };
  var vittelwater = {
    name: 'Vittel',
    observations: [
      {value: 7.7, uom: "mg_l", code: "natrium"},
      {value: 5.2, uom: "mg_l", code: "kalium"},
      {value: 94, uom: "mg_l", code: "calcium"},
      {value: 208, uom: "mg_l", code: "magnesium"},
      {value: 0.22, uom: "mg_l", code: "fluoride"},
      {value: 38, uom: "mg_l", code: "chloride"},
      {value: 120, uom: "mg_l", code: "sulfate"},
      {value: 455, uom: "mg_l", code: "hydrogene"},
      {value: 120, uom: "mg_l", code: "nitrate"}
    ],
    sources: ['http://books.google.de/books?id=lzEoGWyqMBwC&pg=PA198&lpg=PA198&dq=volvic+nitratgehalt&source=bl&ots=pJEE0i9HwK&sig=OI_PeSr_QGBCfpeVCu70N4ohy8g&hl=de&ei=4-yvSuHrJ8jK_gbV0p3ZDA&sa=X&oi=book_result&ct=result&resnum=6#v=onepage&q&f=false"]'],
    vendor: "vittel"
  };

  var heiligenquelleclassic = {
    name: 'HEILIGENQUELLE CLASSIC',
    observations: [
      {value: 10.7, uom: "mg_l", code: "natrium"},
      {value: 2.6, uom: "mg_l", code: "kalium"},
      {value: 118, uom: "mg_l", code: "calcium"},
      {value: 48, uom: "mg_l", code: "magnesium"},
      {value: 0.22, uom: "mg_l", code: "fluorid"},
      {value: 43, uom: "mg_l", code: "chlorid"},
      {value: 68, uom: "mg_l", code: "sulfat"},
      {value: 455, uom: "mg_l", code: "hydrogene"}
    ],
    sources: ['http://wueteria.de/unser-wasser/unsere-mineralwasserquellen/'],
    vendor: "wueteria"
  };
  var teussernaturell = {
    name: 'Teusser Naturell',
    observations: [
      {value: 53, uom: "mg_l", code: "natrium"},
      {value: 7, uom: "mg_l", code: "kalium"},
      {value: 537, uom: "mg_l", code: "calcium"},
      {value: 0.5, uom: "mg_l", code: "nitrate"},
      {value: 92, uom: "mg_l", code: "magnesium"},
      {value: 0.21, uom: "mg_l", code: "fluoride"},
      {value: 27, uom: "mg_l", code: "chloride"},
      {value: 1467, uom: "mg_l", code: "sulfate"},
      {value: 357, uom: "mg_l", code: "hydrogene"}
    ],
    sources: ['http://www.teusser.de/index.php?id=225'],
    vendor: "teusser"
  };

  /*
   * Test the /POST MineralWater route
   */
  describe('POST teussernaturell', function() {
    it('it should return teussernaturell', function(done) {
      chai.request(app)
        .post('/api/product')
        .set('x-access-token', token)
        .send(teussernaturell)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('POST heiligenquelleclassic', function() {
    it('it should return heiligenquelleclassic', function(done) {
      chai.request(app)
        .post('/api/product')
        .set('x-access-token', token)
        .send(heiligenquelleclassic)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('POST vittelwater', function() {
    it('it should return vittelwater', function(done) {
      chai.request(app)
        .post('/api/product')
        .set('x-access-token', token)
        .send(vittelwater)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('POST volvic_50cl', function() {
    it('it should return volvic_50cl', function(done) {
      chai.request(app)
        .post('/api/product')
        .set('x-access-token', token)
        .send(volvic_50cl)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });
  /*
   * Test the /GET MineralWater route
   */
  describe('GET Products', function() {
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


});
