process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');
var models = require('../models');

var testdata = require('../assets/zones/heilbronn.json');

describe('inserting zones', function() {
  var token;

  before(function(done) {
    var Chance = require('chance');
    var chance = new Chance();
    token = chance.guid();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: token
    };
    new models.User.model(testuser).save(function(err) {
      if(err) done(err);
      else done();
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
      if(err) done(err);
      else done();
    });
  });

  it('should post Zones for Mannheim, Germany', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/mannheim.json').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 9);
        done();
      }
    });
  });

  it('should post Zones for Brabant water, the Netherlands', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/brabantwater.json').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 69);
        done();
      }
    });
  });

  it('should post Zones for PWN, the Netherlands', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/pwn.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 5);
        done();
      }
    });
  });

  it('should post Zones for Evides, the Netherlands', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/evides.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 11);
        done();
      }
    });
  });

  it('should post Zones for Dunea, the Netherlands', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/dunea.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 17);
        done();
      }
    });
  });

  it('should post Zones for Waternet, the Netherlands', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/waternet.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 2);
        done();
      }
    });
  });

  it('should post Zone for Bonaire', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/bq.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 1);
        done();
      }
    });
  });

  it('should post Zone for Sint Maarten', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/sx.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 1);
        done();
      }
    });
  });

  it('should post Zone for Curacao', function(done) {
    request(app).
    post('/api/zones').
    set('x-access-token', token).
    attach('file', './assets/zones/cw.geojson').
    expect(200).
    end(function(err, res) {
      if(err) {
        done(err);
      } else {
        var data = JSON.parse(res.text);
        assert.equal(data.zones.length, 1);
        done();
      }
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
        if(err) {
          done(err);
        } else {
          var data = JSON.parse(res.text);
          assert.equal(data.name, instance.properties.name);
          done();
        }
      });
    });
  });
});
