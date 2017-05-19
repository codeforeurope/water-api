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
  var natrium = models.Code.model.i18nInit('en', { standard: 'CAS', value: '7440-23-5', label: 'Sodium' });
  // Manually set language labels
  natrium.i18nSet('de', {
    label: 'Natrium'
  });
  natrium.i18nSet('nl', {
    label: 'Natrium'
  });
  // Create with i18n
  models.Code.model.create({ standard: 'CAS', value: '7440-09-7', label: {en: 'Potassium', nl: 'Kalium', de: 'Kalium'} });
  models.Code.model.create({ standard: 'CAS', value: '7440-70-2', label: {en: 'Calcium'} });
  models.Code.model.create({ standard: 'CAS', value: '14797-55-8', label: {en:'Nitrate'} });
  models.Code.model.create({ standard: 'CAS', value: '7439-95-4', label: {en:'Magnesium'} });
  models.Code.model.create({ standard: 'CAS', value: '16984-48-8', label: {en:'Fluoride'} });
  models.Code.model.create({ standard: 'CAS', value: '16887-00-6', label: {en:'Chloride'} });
  models.Code.model.create({ standard: 'CAS', value: '14808-79-8', label: {en:'Sulfate'} });
  models.Code.model.create({ standard: 'CAS', value: '1333-74-0', label: {en:'Hydrogen'} });
  models.Code.model.create({ standard: 'CAS', value: '', label: {en:'Microbacteria'} });
  models.Code.model.create({ standard: 'CAS', value: '', label: {en:'Bicarbonate (HCO3)'} });
  models.Code.model.create({ standard: 'CAS', value: '3163-01-7', label: {en:'Silicate'} });
  models.Code.model.create({ standard: 'CAS', value: '', label: {en:'Trihalomethanes (THMS)'} });
  describe('Calcium should not have a nl label', function() {
    it('it should be undefined', function(done) {
        var calcium = models.Code.model.i18nInit('en', { standard: 'CAS', value: '7440-70-2', label: {en: 'Calcium'} });
        should.equal(calcium.toObjectTranslated({ translation: 'nl' }).label, undefined);
      done();
    });
  });

});
