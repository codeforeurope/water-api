var models = require('../models');

function trim_nulls(data) {
  var y;
  for (var x in data) {
    y = data[x];
    if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length === 0)) {
      delete data[x];
    }
    if (y instanceof Object) y = trim_nulls(y);
  }
  return data;
}
/**
 * Compact arrays with null entries; delete keys from objects with null value
 *
 * @param {json} data
 * @returns data with nulls removed.
 */
clean = function(data) {
  var obj2 = JSON.parse(JSON.stringify(data));
  delete obj2.entered_at;
  delete obj2.__v;
  delete obj2._id;
  return trim_nulls(obj2);
};

exports.clean = clean;

/**
 * Try to create an observation from the json object
 *
 * Requires a json object with 3 fields in the form of:
 * { "value": 10, "uom": "mg_l", "code": "natrium" }
 */
exports.createObservation = function(jsonObject, user, type, cb){
  //get mgl
  var uom;
  var code;
  models.Uom.model.findOne({
    "code": jsonObject.uom
  }, function(err, _uom) {
    if(err) cb(err, null);
    uom = _uom;
    models.Code.model.findOne({code: jsonObject.code}, function(err, _code) {
      if (err) {
        cb(err, null);
      } else {
        code = _code;
        var _observation = models.Observation.model.create({
          value: jsonObject.value,
          uom: uom,
          code: code,
          type: type,
          entered_by: user
        }, function(err,result) {
          if (err) {
            cb(err, null);
          } else {
            cb(null, result);
          }
        });
      }
    });
  });
};

/**
 * Transforms a observation from mongodb to a
 * Representation that can be sent as
 * a response.
 */
exports.cleanObservations = function(source, locale){
  var output = source.toJSONLocalizedOnly(locale, 'en');
  output = clean(output);
  if(output.limits){
    _outputArrayName = "limits";
    _outputobservations = output.limits;
  } else if (output.observations){
    _outputArrayName = "observations";
    _outputobservations = output.observations;
  } else {
    return output;
  }
  var _observations = [];

  for (var x in _outputobservations) {
    var _observation = {
      uom: _outputobservations[x].uom.label,
      code: _outputobservations[x].code.label,
      value: _outputobservations[x].value
    };
    _observations.push(_observation);
  }
  output[_outputArrayName] = _observations;
  return output;
};
