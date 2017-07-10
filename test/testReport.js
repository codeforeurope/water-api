process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

var testdata = require('../assets/reports/heilbronn.json');

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

  it('should post Reports for Mannheim', function(done) {
    request(app).
    post('/api/reports').
    set('x-access-token', token).
    attach('file', './assets/reports/mannheim.json').
    expect(200).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.reports.length, 11);
      done();
    });
  });
  it('should post Reports for Brabant Water', function(done) {
    request(app).
    post('/api/reports').
    set('x-access-token', token).
    attach('file', './assets/reports/brabantwater.json').
    expect(200).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.reports.length, 57);
      done();
    });
  });
  it('should post Reports for Dunea', function(done) {
    request(app).
    post('/api/reports').
    set('x-access-token', token).
    attach('file', './assets/reports/dunea.json').
    expect(200).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.reports.length, 15);
      done();
    });
  });
  it('should post Reports for PWN', function(done) {
    request(app).
    post('/api/reports').
    set('x-access-token', token).
    attach('file', './assets/reports/pwn.json').
    expect(200).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.reports.length, 48);
      done();
    });
  });
  it('should post Reports for Evides', function(done) {
    request(app).
    post('/api/reports').
    set('x-access-token', token).
    attach('file', './assets/reports/evides.json').
    expect(200).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.reports.length, 96);
      done();
    });
  });
});
