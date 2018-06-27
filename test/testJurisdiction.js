process.env.NODE_ENV = 'test';

var assert = require('assert');
var request = require('supertest');
var app = require('../server');

it('GET local government by coordinates should return Vught', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "lat": 51.6362, "lon": 5.2981 }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Vught');
    assert.equal(data.type, 'local government');
    assert.equal(data.country, 'nl');
    done();
  });
});

it('GET local government by coordinates should return Eindhoven', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "lat": 51.4547, "lon": 5.4212 }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Eindhoven');
    assert.equal(data.type, 'local government');
    assert.equal(data.country, 'nl');
    done();
  });
});

it('GET local government by coordinates should return Eindhoven', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "lat": 51.4202, "lon": 5.4976 }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Eindhoven');
    assert.equal(data.type, 'local government');
    assert.equal(data.country, 'nl');
    done();
  });
});

it('GET local government by address should return Eindhoven', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "q": "eindhoven" }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Eindhoven');
    assert.equal(data.type, 'local government');
    assert.equal(data.country, 'nl');
    done();
  });
});

it('GET local government by address should return Vught', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "q": "beukenlaan 2 vught" }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Vught');
    assert.equal(data.type, 'local government');
    assert.equal(data.country, 'nl');
    done();
  });
});

it('GET local government by address should return Rotterdam', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "q": "rotterdam" }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Rotterdam');
    assert.equal(data.country, 'nl');
    done();
  });
});

it('GET local government by coordinates should return Dublin', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "lat": 53.35457385, "lon": -6.28105931973511 }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Dublin');
    assert.equal(data.type, 'local government');
    assert.equal(data.country, 'ie');
    done();
  });
});

it('GET local government by address should return Dublin', function(done) {
  request(app).
  get('/api/jurisdiction').
  query({ "q": "donnybrook close" }).
  expect(200).
  end(function(err, res) {
    if (err) done(err);
    var data = JSON.parse(res.text);
    assert.equal(data.jurisdiction, 'Dublin');
    assert.equal(data.country, 'ie');
    done();
  });
});
