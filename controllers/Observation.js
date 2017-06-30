(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');

  module.exports.getobservationsavg = function (req, res, next) {
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
            // Grab all uoms so we can use them for unit conversion.
            models.Uom.model.find(function(err,uoms){
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
                _observations = utils.getAggregatedObject(_observations, _observation);
              }
              // Now parse observations (once more);
              var formattedobservations = [];
              for(var i=0; i<_observations.length; i++) {
                formattedobservations.push(utils.parseObservation(_observations[i], uoms, req.locale));
              }
              res.setHeader('content-type', 'application/json');
              res.setHeader('charset', 'utf-8');
              res.end(JSON.stringify(formattedobservations, null, 2));
            });
          });
        });
      }
    });
  };
  }());
