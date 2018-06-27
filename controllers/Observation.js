(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');
  var async = require("async");
  var populateoptions = [
    {
      path: 'uom',
      model: 'Uom',
      select: 'label code -_id'
    },{
      path: 'code',
      model: 'Code',
      select: 'label description -_id'
    }
  ];
  module.exports.getobservationserrors = function (req, res, next) {
    models.Observation.model.find({$where: "this.value > this.max"}).
    populate(populateoptions).
    exec(function(err, result){
      if(err){
        next(err);
      }
      if(result){
        var final = {};
        //get the report per observation
        async.each(result,
          function(feature, callback){
            var temp = {
              "code": feature.code.label.en,
              value: feature.value,
              max: feature.max,
              min: feature.min
            };
            models.Report.model.find({ observations: { $in: [feature] } }).exec(function(err,result2){
              if(err){
                next(err);
              }
              if(result2){
                final[result2[0].name] = final[result2[0].name] || {report:result2[0].sources[0], errors:[]};
                final[result2[0].name].errors.push(temp);
                callback()
              }
            });
          }, function(err){
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(final, null, 2));
          }
        );


      }
    });
  };

  module.exports.getobservationsavg = function (req, res, next) {
    models.Observation.model.aggregate([
      {
        $match: {
          type: {
            $nin: ["Norm","Label", "Unknown"] //exclude Norm as it is for reports
          }
        }
      },{
        $group: {
          _id: {"code": "$code", "uom": "$uom"},
          values: {
            $push: "$value"
          }
        }
      }]).exec(function(err, result){
      if(err){
        next(err);
      } else {
        if(result){
          models.Code.model.populate(result, {path: '_id.code'}, function(err, populatedTransactions) {
            if(err) {
              next(err);
            } else {
              models.Uom.model.populate(populatedTransactions,{path: '_id.uom'}, function(err, finalResult){
                if(err) {
                  next(err);
                } else {
                  // Grab all uoms so we can use them for unit conversion.
                  models.Uom.model.find(function(err,uoms){
                    // Your populated translactions are inside populatedTransactions
                    var _observations = [];
                    if(err) {
                      next(err);
                    } else {
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
                        var parsed = utils.parseObservation(_observations[i], uoms, req.locale)
                        formattedobservations.push(parsed);
                      }
                      res.setHeader('content-type', 'application/json');
                      res.setHeader('charset', 'utf-8');
                      res.end(JSON.stringify(formattedobservations, null, 2));
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  };
  }());
