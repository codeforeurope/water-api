process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

var testdata = require('./assets/reports/heilbronn.json');

describe('inserting reports', function() {
  var token;
  var user;
  var zones = [];

  before(function(done) {
    var Chance = require('chance');
    var chance = new Chance();
    token = chance.guid();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: token
    };
    new models.User.model(testuser).save();
    models.Zone.model.find().
    select('name code _id').
    exec(function(err, _zones){
      zones = [];
      for (var zone in _zones) {
        zones[_zones[zone].name] = _zones[zone]._id;
      }
      done();
    });
  });
  testdata.forEach(function(instance) {
    it('should return ' + instance.name, function(done) {
      if(zones[instance.zone]){
        instance.zone = zones[instance.zone];
      } else {
        delete instance.zone;
      }
      request(app).
      post('/api/report').
      set('x-access-token', token).
      send(instance).
      expect(200).
      end(function(err, res) {
        var data = JSON.parse(res.text);
        assert.equal(data.name, instance.name);
        done();
      });
    });
  });
});
