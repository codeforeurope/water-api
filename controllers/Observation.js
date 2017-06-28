(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');

  function arrayMin(arr) {
    var len = arr.length, min = Infinity;
    while (len--) {
      if (Number(arr[len]) < min) {
        min = Number(arr[len]);
      }
    }
    return min;
  }

  function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
      if (Number(arr[len]) > max) {
        max = Number(arr[len]);
      }
    }
    return max;
  }
  function arrayAverage(arr){
    var sum = arr.reduce(function(a, b) { return a + b; });
    var avg = sum / arr.length;
    return avg;
  }
  function getAggregatedObject(arr, obj) {
      for(var i=0; i<arr.length; i++) {
          if (arr[i].code.label == obj.code.label){
            //Do something smart, return the array
            if(arr[i].uom.label !== obj.uom.label){
              //console.log(obj);
              var vals = [];
              //get the code values, unit transform and add to array of values
              switch(true){
                case arr[i].uom.code === 'mg_l' && obj.uom.code === 'mug_l':
                  vals = obj.values;
                  //divide by 1000
                  for(var j=0; j<vals.length; j++) {
                    arr[i].values.push(vals[j]/1000);
                  }
                  break;
                case arr[i].uom.code === 'mug_l' && obj.uom.code === 'mg_l':
                  vals = obj.values;
                  //divide by 1000
                  for(var k=0; k<vals.length; k++) {
                    arr[i].values.push(vals[k]*1000);
                  }
                  break;
                case arr[i].uom.code === 'dh' && obj.uom.code === 'mmol_l':
                  vals = obj.values;
                  //divide by 1000
                  for(var l=0; l<vals.length; l++) {
                    arr[i].values.push(vals[l]*5.6);
                  }
                  break;
                case arr[i].uom.code === 'mmol_l' && obj.uom.code === 'dh':
                  vals = obj.values;
                  //divide by 1000
                  for(var m=0; m<vals.length; m++) {
                    arr[i].values.push(vals[m]/5.6);
                  }
                  break;
                default:
                  console.log("Different " + arr[i].uom.code + ' and ' + obj.uom.code + " for " + obj.code.code);
              }
            }
            return arr;
          }
      }
      // Not found, new object
      arr.push(obj);
      return arr;
  }

  module.exports.getobservationsavg = function (req, res, next) {
    //find a limit from the database
    models.Observation.model.aggregate(
      {
        $match: {
          type: {
            $nin: ["Limit","Label", "Unknown"] //exclude Limit as it is for reports
          }
        }
      },{
        $group: {
          _id: {"code": "$code", "uom": "$uom"},
          values: {
            $push: "$value"
          }
        }
      }).exec(function(err, result){
      if(err){
        next(err);
      }
      if(result){
        models.Code.model.populate(result, {path: '_id.code'}, function(err, populatedTransactions) {
          models.Uom.model.populate(populatedTransactions,{path: '_id.uom'}, function(err, finalResult){
            // Your populated translactions are inside populatedTransactions
            var _observations = [];
            if(err){
              next(err);
            }

            for (var x in finalResult) {
              var code = finalResult[x]._id.code.toJSONLocalizedOnly(req.locale, 'en');
              var uom = finalResult[x]._id.uom.toJSONLocalizedOnly(req.locale, 'en');
              //Check to see if the observation is already there. If not, add it, else, calculate new average by using unit conversion.
              var _observation = {
                code: code,
                values: finalResult[x].values,
                uom: uom
              };
              _observations = getAggregatedObject(_observations, _observation);
            }
            // Now parse observations (once more);
            var formattedobservations = [];
            for(var i=0; i<_observations.length; i++) {
              formattedobservations.push({
                code: _observations[i].code.label,
                uom:  _observations[i].uom.label,
                average: arrayAverage(_observations[i].values),
                min: arrayMin(_observations[i].values),
                max: arrayMax(_observations[i].values),
                //values: _observations[i].values,
                count: _observations[i].values.length
              });
            }
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(formattedobservations, null, 2));
          });
        });
      }
    });
  };
  }());
