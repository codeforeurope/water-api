var models = require('../models');
var math = require('mathjs');
math.createUnit('dH', '0.179 mmol/L'); //Deutsche Härte
math.createUnit('cfu'); //Colony forming units
math.createUnit('ftu'); //Formazine turbidity units
math.createUnit('pH'); //Potential of Hydrogen (Acidity)
math.createUnit('Eq'); //equivalent
math.createUnit('Bq'); //Becquerel per liter, might be convertable, need to investigate

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
clean = function(data, keep) {
  var obj2 = JSON.parse(JSON.stringify(data));
  delete obj2.entered_at;
  delete obj2.__v;
  if(keep){
    obj2.id = obj2._id;
  }
  delete obj2._id;
  return trim_nulls(obj2);
};

arrayMin = function (arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (Number(arr[len]) < min) {
      min = Number(arr[len]);
    }
  }
  return min;
};
arrayMax = function(arr) {
  var len = arr.length, max = -Infinity;
  while (len--) {
    if (Number(arr[len]) > max) {
      max = Number(arr[len]);
    }
  }
  return max;
};
arrayAverage = function(arr){
  var sum = arr.reduce(function(a, b) { return a + b; });
  if(arr.length === 0){
    return 0.0;
  } else {
    var avg = sum / arr.length;
    return parseFloat(avg.toFixed(3));
  }
};

getUomLabel = function(uoms,code,locale){
  for(var i=0; i<uoms.length; i++) {
    if(uoms[i].code === code){
      return uoms[i].label.locale || uoms[i].label.en;
    }
  }
};

exports.clean = clean;
exports.arrayMin = arrayMin;
exports.arrayMax = arrayMax;
exports.arrayAverage = arrayAverage;

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
        var obs = {
          value: jsonObject.value,
          min: jsonObject.min,
          max: jsonObject.max,
          samples: jsonObject.samples,
          uom: uom,
          code: code,
          type: type,
          entered_by: user
        };
        if(jsonObject.entered_at){
          obs.entered_at = jsonObject.entered_at;
        }
        var _observation = models.Observation.model.create(obs, function(err,result) {
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
exports.cleanObservations = function(source, locale, flatten){
  var output = source.toJSONLocalizedOnly(locale, 'en');
  output = clean(output, true);
  if(output.vendor){
    output.vendor = clean(output.vendor, true);
  }
  _outputArrayName = "observations";
  if(output.observations){
    _outputobservations = output.observations;
  } else {
    _outputobservations = [];
  }
  var _observations = [];

  for (var x in _outputobservations) {
    var _observation = {
      uom: {
        "label":_outputobservations[x].uom.label,
        "code": _outputobservations[x].uom.code
      },
      code: _outputobservations[x].code.label,
      value: _outputobservations[x].value,
      min: _outputobservations[x].min,
      max: _outputobservations[x].max,
      samples: _outputobservations[x].samples,
      description: _outputobservations[x].code.description,
    };
    if(flatten){
      _outputArrayName = "limits";
      _observation.uom = _outputobservations[x].uom.label;
      delete output.observations;
    }
    _observations.push(_observation);
  }
  var presort = _observations.slice(0);
  output[_outputArrayName] = presort.sort(
    function(a,b){
      var x = a.code.toLowerCase();
      var y = b.code.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    }
  );
  return output;
};
exports.getAggregatedObject = function(arr, obj) {
  for(var i=0; i<arr.length; i++) {
    if (arr[i].code.label == obj.code.label){
      //Do something smart, return the array
      if(arr[i].uom.code !== obj.uom.code){
        var vals = obj.values;
        //get the code values, unit transform and add to array of values
        for(var j=0; j<vals.length; j++) {
          var conversion = vals[j] + ' ' + obj.uom.code + ' to ' + arr[i].uom.code;
          var converted = math.eval(conversion);
          arr[i].values.push(parseFloat(converted.to(arr[i].uom.code).toString().split(' ')[0]).toFixed(3));
        }
      }
      //console.log(arr);
      return arr;
    }
  }
    // Not found, new object
    arr.push(obj);
    return arr;
};

exports.parseObservation = function(observation, uoms, locale){
  // Is the values object present and an array?
  if(observation.values){
    var values = observation.values;
    var uom = {
      code: observation.uom.code,
      label: observation.uom.label,
    };
    // values = observation.values.map(function(value){
    //   return value * 10;
    // });

    return {
      code: observation.code.label,
      uom:  uom,
      min: arrayMin(values),
      average: arrayAverage(values),
      max: arrayMax(values),
      count: values.length
    };
  }
  // Else, is it a regular observation?
};
