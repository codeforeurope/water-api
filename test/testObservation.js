process.env.NODE_ENV = 'test';

var assert = require('assert');
var models = require('../models');

describe('inserting observation', function() {
  var user;

  before(function(done) {
    var Chance = require('chance');
    var chance = new Chance();
    var testuser = {
      name: chance.name(),
      email: chance.email(),
      token: chance.guid()
    };
    new models.User.model(testuser).save(function(err, result, count) {
      user = result;
      done();
    });
  });

  it('should return Kalium', function(done) {
    models.Uom.model.findOne({ "code": "mg/l" }, function(err, mgl){
      models.Code.model.findOne({standard: 'CAS', value: '7440-09-7'},function(err, potassium){
        var testObservation = models.Observation.model({ value: 200, uom: mgl, code: potassium, entered_by: user });
        testObservation.save(function(err, result, count){
          var out = result.toJSONLocalizedOnly('nl','en');
          assert.equal(out.code.label, 'Kalium');
          done();
        });
      });
    });
  });
});
