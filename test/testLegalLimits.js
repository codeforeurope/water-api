//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');
var Chance = require('chance');

chai.use(chaiHttp);
var should = chai.should();
var chance = new Chance();

describe('testing /api/limits', function() {
  describe('Insert set of Limits', function() {
    it('it should return array with US and EU limits', function(done) {
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
      var mgl = models.Uom.model({
        value: {en: 'mg/L'},
        label: {en: 'mg/L'},
        definition: {en: 'Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L'},
        entered_by: user
      });

      mgl.save(function (err, mgl, count) {
        mgl = mgl;
      });

      var natrium = models.Code.model({ standard: 'CAS', value: '7440-23-5', label: {en:'Sodium'}, entered_by: user });
      var kalium = models.Code.model({ standard: 'CAS', value: '7440-09-7', label: {en: 'Potassium'}, entered_by: user });
      var calcium = models.Code.model({ standard: 'CAS', value: '7440-70-2', label: {en:'Calcium' }, entered_by: user});
      var nitrat = models.Code.model({ standard: 'CAS', value: '14797-55-8', label: {en:'Nitrate' }, entered_by: user});
      var magnesium = models.Code.model({ standard: 'CAS', value: '7439-95-4', label: {en:'Magnesium'}, entered_by: user });
      var fluorid = models.Code.model({ standard: 'CAS', value: '16984-48-8', label: {en:'Fluoride' }, entered_by: user});
      var chlorid = models.Code.model({ standard: 'CAS', value: '16887-00-6', label: {en:'Chloride' }, entered_by: user});
      var sulfat = models.Code.model({ standard: 'CAS', value: '14808-79-8', label: {en:'Sulfate' }, entered_by: user});
      var hydrogene = models.Code.model({ standard: 'CAS', value: '1333-74-0', label: {en:'Hydrogen' }, entered_by: user});
      var microbacteria = models.Code.model({ standard: 'CAS', value: '', label: {en:'Microbacteria' }, entered_by: user});
      var bicarbonate = models.Code.model({ standard: 'CAS', value: '', label: {en:'Bicarbonate (HCO3)' }, entered_by: user});
      var silica = models.Code.model({ standard: 'CAS', value: '3163-01-7', label: {en:'Silicate' }, entered_by: user});
      var trihalomethane = models.Code.model({ standard: 'CAS', value: '', label: {en:'Trihalomethanes (THMS)' }, entered_by: user});
      var arr = [
        models.Observation.model({ value: 200, uom: mgl, code: natrium , entered_by: user}),
        models.Observation.model({ value: null, uom: mgl, code: kalium , entered_by: user}),
        models.Observation.model({ value: null, uom: mgl, code: calcium , entered_by: user}),
        models.Observation.model({ value: 50, uom: mgl, code: nitrat , entered_by: user}),
        models.Observation.model({ value: null, uom: mgl, code: magnesium, entered_by: user }),
        models.Observation.model({ value: 0, uom: mgl, code: fluorid , entered_by: user}),
        models.Observation.model({ value: 250, uom: mgl, code: chlorid , entered_by: user}),
        models.Observation.model({ value: 250, uom: mgl, code: sulfat, entered_by: user }),
        models.Observation.model({ value: null, uom: mgl, code: hydrogene, entered_by: user }),
        models.Observation.model({ value: null, uom: mgl, code: microbacteria , entered_by: user}),
        models.Observation.model({ value: null, uom: mgl, code: bicarbonate, entered_by: user }),
        models.Observation.model({ value: null, uom: mgl, code: silica, entered_by: user }),
        models.Observation.model({ value: null, uom: mgl, code: trihalomethane , entered_by: user})
      ];

      models.Observation.model.insertMany(arr, function(error,docs){
        var uslimit = models.Limit.model({
          name: 'US',
          limits: docs,
          sources: ['https://www.epa.gov/dwstandardsregulations/secondary-drinking-water-standards-guidance-nuisance-chemicals',
            'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Chemicalcontaminants.shtml',
            'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Documents/EDTlibrary/storlist.xls'],
          authority: null
        });

        uslimit.save(function(err, result, count){
          var out = result.toJSONLocalizedOnly('nl','en');
          should.equal(out.name, 'US');
          should.equal(out.sources.length, 3);
          done();
        });
      });
    });
  });


  describe('GET limits', function() {
    it('it should return array with US and EU limits', function(done) {
      chai.request(app)
        .get('/api/limits')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          data.should.be.instanceof(Array);
          data.should.have.lengthOf(2);
          res.should.be.json; // jshint ignore:line
          res.should.have.status(200);
          done();
        });
    });
  });
});
