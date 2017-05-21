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
describe('testing inserting observation', function() {
  it('it should be Valid', function(done) {
    models.Uom.model.findOne({ "code": "mg_l" }, function(err, mgl){
      models.Code.model.findOne({standard: 'CAS', value: '7440-09-7'},function(err, potassium){
        var testObservation = models.Observation.model({ value: 200, uom: mgl, code: potassium, entered_by: user });
        testObservation.save(function(err, result, count){
          var out = result.toJSONLocalizedOnly('nl','en');
          should.equal(out.code.label, 'Kalium');
          done();
        });
      });
    });
  });
});
