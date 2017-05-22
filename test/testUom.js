//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

var app = require('../server');
var models = require('../models');
var Chance = require('chance');
var chance = new Chance();



describe('testing inserting units of measure', function() {

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

  describe('mg_l', function() {
    it('it should be mg/L', function(done) {
      var mgl = models.Uom.model({
        code: 'mg_l',
        value: {en: 'mg/L'},
        label: {en: 'mg/L'},
        definition: {en: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'},
        entered_by: user
      });
      mgl.save(function(err, mgl, count){
        var out = mgl.toJSONLocalizedOnly('de', 'en');
        should.equal(out.label, 'mg/L');
        done();
      });
    });
  });
});
