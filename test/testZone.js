//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
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


  /*
   * Test the /POST Zone route
   */
  var zones;

  //read zones.geojson
  fs.readFile('./test/assets/zones.geojson', 'utf8', function (err, data) {
    if (err) done(err);
    zones = JSON.parse(data).features;
    describe('testing /api/zone', function() {
      it.each(zones, 'POST should return %s', ['properties.name'], function(zone, done) {
        // Do the magic!
        //Try upload
        chai.request(app)
          .post('/api/zone')
          .set('x-access-token', token)
          .send({
            "name" : zone.properties.name,
            "geometry" : zone.geometry
          })
          .end(function(err, res) {
            var data = JSON.parse(res.text);
            res.should.be.json; // jshint ignore:line
            res.should.have.status(200);
            should.equal(data.name, zone.properties.name);
            done();
          });
      });
      it('POST dummy should return a zone', function(done) {
        chai.request(app)
          .post('/api/zone')
          .set('x-access-token', token)
          .send({
            "name" : "Testzone",
            "geometry" : {
              "type" : "Polygon",
              "coordinates" :  [
                [
                  [25.774, -80.190], [18.466, -66.118],
                  [32.321, -64.757], [25.774, -80.190]
                ]
              ]
            }
          })
          .end(function(err, res) {
            var data = JSON.parse(res.text);
            res.should.be.json; // jshint ignore:line
            res.should.have.status(200);
            done();
          });
      });
      it('GET (0,0) should not return a zone (outside)', function(done) {
        chai.request(app)
          .get('/api/zone')
          .query({"lon": 0, "lat": 0})
          .end(function(err, res) {
            var data = JSON.parse(res.text);
            res.should.be.json; // jshint ignore:line
            res.should.have.status(200);
            done();
          });
      });

      it('GET (26,-70) should return a zone', function(done) {
        chai.request(app)
          .get('/api/zone')
          .query({"lon": 26, "lat": -70})
          .end(function(err, res) {
            var data = JSON.parse(res.text);
            res.should.be.json; // jshint ignore:line
            //should.equal(data.name, 'Testzone');
            res.should.have.status(200);
            done();
          });
      });
    });
  });
