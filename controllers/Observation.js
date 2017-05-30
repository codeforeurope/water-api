(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');

  module.exports.getobservationsavg = function (req, res, next) {
    //find a limit from the database
    models.Observation.model.aggregate(
      { $unwind: "$code" },
      {
        $match: {
          type: {
            $nin: ["Limit","Label", "Unknown"] //exclude Limit as it is for reports
          }
        }
      },{
        $group: {
          _id: "$code",
          average: {
            $avg: "$value"
          }
        }
      }).exec(function(err, result){
      if(err){
        next(err);
      }
      if(result){
        models.Code.model.populate(result, {path: '_id'}, function(err, populatedTransactions) {
            // Your populated translactions are inside populatedTransactions
            var _observations = [];
            if(err){
              next(err);
            }
            //console.log(populatedTransactions);
            for (var x in populatedTransactions) {
              var code = populatedTransactions[x]._id.toJSONLocalizedOnly(req.locale, 'en');
              var _observation = {
                code: code.label,
                value: populatedTransactions[x].average
              };
              _observations.push(_observation);
            }
            //console.log(populatedTransactions);
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(_observations, null, 2));
        });

      }
    });
  };
  }());
