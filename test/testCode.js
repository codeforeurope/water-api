process.env.NODE_ENV = 'test';

var assert = require('assert');
var app = require('../server');
var models = require('../models');
var testdata = require('../assets/codes.json');

describe('inserting codes', function() {
  testdata.forEach(function(instance) {
    it('should return ' + instance.label.en, function(done) {
      var test = models.Code.model(instance);
      test.save(function(err, test, count) {
        var out = test.toJSONLocalizedOnly('en', 'en');
        assert.equal(out.label, instance.label.en);
        done();
      });
    });
  });
});
