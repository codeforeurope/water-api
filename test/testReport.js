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
  var zones = {};
  var reports;
  //read zones.geojson
  fs.readFile('./test/assets/reports.json', 'utf8', function (err, data) {
    if (err) console.log(err);
    reports = JSON.parse(data);
    describe('testing /api/report', function() {
      before(function(done){
        models.Zone.model.find().
        select('name code _id').
        exec(function(err, _zones){
          for (var zone in _zones) {
            zones[_zones[zone].name] = _zones[zone]._id;
          }
          done();
        });
      });
      it.each(reports, 'POST should return %s', ['name'], function(report, done) {
        //Try upload
        report.zone = zones[report.zone] || null;
        chai.request(app)
          .post('/api/report')
          .set('x-access-token', token)
          .send(report)
          .end(function(err, res) {
            var data = JSON.parse(res.text);
            res.should.be.json; // jshint ignore:line
            res.should.have.status(200);
            should.equal(data.name, report.name);
            done();
          });
      });
    });
  });
