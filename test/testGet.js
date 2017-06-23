process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');

it('GET Companies should return array with companies', function(done) {
  request(app).
  get('/api/companies').
  expect(200).
  end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.length, 23);
      done();
    });
});

it('GET Company should return wueteria', function(done) {
  request(app).
  get('/api/company').
  query({ code: 'wueteria' }).
  expect(200).
  end(function(err, res) {
    var data = JSON.parse(res.text);
    assert.equal(data.code, 'wueteria');
    assert.equal(data.url, 'http://wueteria.de');
    assert.equal(data.country, 'DE');
    done();
  });
});

it('GET limits should return array of 3 limits', function(done) {
  request(app).
  get('/api/limits').
  expect(200).
  end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.length, 3);
      done();
    });
});

it('GET limit should return EU limit', function(done) {
  request(app).
  get('/api/limit').
  query({ code: 'EU' }).
  expect(200).
  end(function(err, res) {
      var data = JSON.parse(res.text);
      assert.equal(data.length, 8);
      done();
    });
});

/*
 * Test the /GET MineralWater route
 */
it('should return array of 4 products', function(done) {
  request(app).
  get('/api/products').
  expect(200).
  end(function(err, res) {
    var data = JSON.parse(res.text);
    assert.equal(data.length, 4);
    done();
  });
});

/*
 * Test the /GET MineralWater route
 */
it('should return Heiligenquelle Classic', function(done) {
  request(app).
  get('/api/product').
  query({ code: 'heiligenquelleclassic' }).
  expect(200).
  end(function(err, res) {
    var data = JSON.parse(res.text);
      assert.equal(data.name, "Heiligenquelle Classic");
      done();
    });
});

it('GET (0,0) should not return a zone (outside)', function(done) {
  request(app).
  get('/api/zone').
  query({"lon": 0, "lat": 0}).
  expect(200).
  end(function(err, res) {
    var data = JSON.parse(res.text);
    done();
  });
});

it('GET (26,-70) should return a zone', function(done) {
  request(app).
  get('/api/zone').
  query({"lon": 26, "lat": -70}).
  expect(200).
  end(function(err, res) {
    var data = JSON.parse(res.text);
    done();
  });
});
