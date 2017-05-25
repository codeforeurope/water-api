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
var uom;
var codes = [];
var user;

describe('testing inserting limit', function() {
  before(function(done) {
    var token = chance.guid();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: token
    };
    user = new models.User.model(testuser);

    user.save(function(err, user, count) {
      user = user;
    });

    //get mgl
    models.Uom.model.findOne({
      "code": "mg_l"
    }, function(err, mgl) {
      uom = mgl;
      //get codes
      models.Code.model.find(function(err, docs) {
        for (var x in docs) {
          var out = docs[x].toJSONLocalizedOnly('en', 'en');
          codes[out.code] = docs[x];
        }
        done();
      });
    });
  });

  describe('US limits', function() {
    it('it should produce US limits', function(done) {
      mgl = uom;
      var arr = [
        models.Observation.model({
          value: 200,
          uom: mgl,
          code: codes.natrium,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 50,
          uom: mgl,
          code: codes.nitrate,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 0,
          uom: mgl,
          code: codes.fluoride,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 250,
          uom: mgl,
          code: codes.chloride,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 250,
          uom: mgl,
          code: codes.sulfate,
          type: 'Limit',
          entered_by: user
        })
      ];
      models.Observation.model.insertMany(arr, function(error, docs) {
        var uslimit = models.Limit.model({
          name: 'US-test',
          limits: docs,
          sources: ['https://www.epa.gov/dwstandardsregulations/secondary-drinking-water-standards-guidance-nuisance-chemicals',
            'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Chemicalcontaminants.shtml',
            'http://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/Documents/EDTlibrary/storlist.xls'
          ],
          authority: null
        });

        uslimit.save(function(err, result, count) {
          var out = result.toJSONLocalizedOnly('nl', 'en');
          should.equal(out.name, 'US-test');
          should.equal(out.sources.length, 3);
          done();
        });
      });
    });
  });
  describe('EU limits', function() {
    it('it should produce EU limits', function(done) {
      mgl = uom;
      var arr = [
        models.Observation.model({
          value: 200,
          uom: mgl,
          code: codes.natrium,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 12,
          uom: mgl,
          code: codes.kalium,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 400,
          uom: mgl,
          code: codes.calcium,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 60,
          uom: mgl,
          code: codes.nitrate,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 60,
          uom: mgl,
          code: codes.magnesium,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 0,
          uom: mgl,
          code: codes.fluoride,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 240,
          uom: mgl,
          code: codes.chloride,
          type: 'Limit',
          entered_by: user
        }),
        models.Observation.model({
          value: 240,
          uom: mgl,
          code: codes.sulfate,
          type: 'Limit',
          entered_by: user
        }),
      ];

      models.Observation.model.insertMany(arr, function(error, docs) {
        var test = models.Limit.model({
          name: 'EU-test',
          limits: docs,
          sources: ['url-needed'],
          authority: null
        });

        test.save(function(err, result, count) {
          var out = result.toJSONLocalizedOnly('nl', 'en');
          should.equal(out.name, 'EU-test');
          should.equal(out.sources.length, 1);
          done();
        });
      });
    });
  });
});
