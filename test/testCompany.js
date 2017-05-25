//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('tz-business-time');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
var Chance = require('chance');

chai.use(chaiHttp);
var should = chai.should();
var chance = new Chance();


var token = chance.guid();
var code = chance.string();

//Companies
var testcompany = {
  code: code,
  name: chance.word(),
  url: 'http://' + chance.domain(),
  country: chance.country({
    full: true
  })
};
var wueteria = {
  code: 'wueteria',
  name: 'Wüteria Mineralquellen GmbH & Co. KG',
  url: 'http://wueteria.de',
  country: 'Germany'
};
var teusser = {
  code: 'teusser',
  name: 'Teusser Mineralbrunnen Karl Rössle GmbH & Co KG',
  url: 'http://wueteria.de',
  country: 'Germany'
};
var jointhepipe = {
  code: 'jointhepipe',
  name: 'Join-The-Pipe',
  url: 'http://join-the-pipe.org/',
  country: 'Netherlands'
};
var vittel = {
  code: 'vittel',
  name: 'Vittel',
  url: 'www.nestle-waters.com/brands/vittel',
  country: ''
};
var volvic = {
  code: 'volvic',
  name: 'Volvic',
  url: 'www.nestle-waters.com/brands/vittel',
  country: ''
};

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
 * Test the /POST Company route
 */
describe('testing /api/company and companies', function() {

  it('POST Company should return the newly created company', function(done) {
    chai.request(app).
    post('/api/company').
    set('x-access-token', token).
    send(testcompany).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      res.should.be.json; // jshint ignore:line
      should.equal(data.code, code);
      res.should.have.status(200);
      done();
    });
  });

  it('POST wueteria should return the newly created wueteria', function(done) {
    chai.request(app).
    post('/api/company').
    set('x-access-token', token).
    send(wueteria).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      res.should.be.json; // jshint ignore:line
      should.equal(data.code, "wueteria");
      res.should.have.status(200);
      done();
    });
  });

  it('POST teusser should return the newly created teusser', function(done) {
    chai.request(app).
    post('/api/company').
    set('x-access-token', token).
    send(teusser).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      res.should.have.status(200);
      done();
    });
  });

  it('POST join the pipe should return the newly created jointhepipe', function(done) {
    chai.request(app).
    post('/api/company').
    set('x-access-token', token).
    send(jointhepipe).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      res.should.be.json; // jshint ignore:line
      should.equal(data.code, 'jointhepipe');
      res.should.have.status(200);
      done();
    });
  });

  it('POST Vittel should return the newly created vittel', function(done) {
    chai.request(app).
    post('/api/company').
    set('x-access-token', token).
    send(vittel).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      res.should.be.json; // jshint ignore:line
      should.equal(data.code, 'vittel');
      res.should.have.status(200);
      done();
    });
  });

  it('POST Volvic should return the newly created volvic', function(done) {
    chai.request(app).
    post('/api/company').
    set('x-access-token', token).
    send(volvic).
    end(function(err, res) {
      var data = JSON.parse(res.text);
      res.should.be.json; // jshint ignore:line
      should.equal(data.code, 'volvic');
      res.should.have.status(200);
      done();
    });
  });

  it('GET Companies should return array with companies', function(done) {
    chai.request(app)
      .get('/api/companies')
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        data.should.be.instanceof(Array);
        data.should.have.lengthOf(6);
        res.should.be.json; // jshint ignore:line
        res.should.have.status(200);
        done();
      });
  });


  it('GET Company should return wueteria', function(done) {
    chai.request(app)
      .get('/api/company')
      .query({
        code: 'wueteria'
      })
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        res.should.be.json; // jshint ignore:line
        should.equal(data.code, 'wueteria');
        should.equal(data.url, 'http://wueteria.de');
        should.equal(data.country, 'Germany');
        res.should.have.status(200);
        done();
      });
  });
});
