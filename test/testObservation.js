//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
var Chance = require('chance');

chai.use(chaiHttp);
var should = chai.should();
var chance = new Chance();

describe('testing inserting i18n codes into the database', function() {
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

  // Create with i18n
  var mgl = models.Uom.model({
    value: {en: 'mg/L', nl: 'mg/L'},
    label: {en: 'mg/L', nl: 'mg/L'},
    definition: {en: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'},
    entered_by: user
  });

  mgl.save(function (err, mgl, count) {
    mgl = mgl;
  });

  var potassium = models.Code.model({ standard: 'CAS', value: '7440-09-7', label: {en: 'Potassium', de: 'Kalium'} });
  var testObservation = models.Observation.model({ value: 200, uom: mgl, code: potassium, entered_by: user });

  describe('Observation should pass', function() {
    it('it should be valid', function(done) {
      testObservation.save(function(err, result, count){
        var out = result.toJSONLocalizedOnly('nl','en');
        should.equal(out.code.label, 'Potassium');
        done();
      });
    });
  });
});
