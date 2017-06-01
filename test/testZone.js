process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

var testdata = require('./assets/zones.json');

describe('inserting zones', function() {
  var token;
  var user;

  before(function(done) {
    var Chance = require('chance');
    var chance = new Chance();
    token = chance.guid();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: token
    };
    new models.User.model(testuser).save(function(err, result, count) {
      user = result;
      done();
    });
  });

  it('should return Testzone', function(done) {
    request(app).
    post('/api/zone').
    set('x-access-token', token).
    send({
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
    }).
    expect(200).
    end(function(err, res) {
        var data = JSON.parse(res.text);
        done();
      });
  });

  testdata.features.forEach(function(instance) {
    it('should return ' + instance.properties.name, function(done) {
      request(app).
      post('/api/zone').
      set('x-access-token', token).
      send({
        "name" : instance.properties.name,
        "geometry" : instance.geometry
      }).
      expect(200).
      end(function(err, res) {
        var data = JSON.parse(res.text);
        assert.equal(data.name, instance.properties.name);
        done();
      });
    });
  });
});
