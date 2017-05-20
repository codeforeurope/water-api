//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');

chai.use(chaiHttp);
var should = chai.should();

describe('testing inserting i18n codes into the database', function() {
  // Create with i18n
  var mgl = models.Uom.model({
    value: {en: 'mg/L', nl: 'mg/L'},
    label: {en: 'mg/L', nl: 'mg/L'},
    definition: {en: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'}
  });
  var potassium = models.Code.model({ standard: 'CAS', value: '7440-09-7', label: {en: 'Potassium', nl: 'Kalium', de: 'Kalium'} });
  var testObservation = models.Observation.model({ value: 200, uom: mgl, code: potassium });
  
  describe('Observation should pass', function() {
    it('it should be valid', function(done) {
        //console.log(mgl.toJSONTranslated({translation: 'nl'}));
        //console.log(potassium.toObjectTranslated({translation: 'nl'}));
        var out = testObservation.toObjectTranslated({ translation: 'nl' });
        //console.log(out);
        should.equal(out.label, undefined);
      done();
    });
  });
});