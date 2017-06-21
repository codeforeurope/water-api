/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');

  // Options for the mongoose query
  var populateoptions = {
    path: 'limits',
    select: 'value min max uom code -_id',
    populate: [{
      path: 'uom',
      model: 'Uom',
      select: 'label -_id'
    },{
      path: 'code',
      model: 'Code',
      select: 'label -_id'
    }]
  };

  module.exports.getlimits = function (req, res, next) {
    var params = req.swagger.params;
    //find a limit from the database
    models.Limit.model.find().
    select('name authority sources limits -_id').
    populate(populateoptions).exec(function(err, limits){
      var final = [];
      if(err){
        next(err);
      }

      for (var limit in limits) {
        var output = utils.cleanObservations(limits[limit], req.locale);
        final.push(output);
      }

      res.setHeader('content-type', 'application/json');
      res.setHeader('charset', 'utf-8');
      res.end(JSON.stringify(final, null, 2));
    });
  };

  module.exports.getlimit = function (req, res, next) {
    var params = req.swagger.params;
    //find a limit from the database
    models.Limit.model.findOne({name: params.code.value}).
    select('name authority sources limits -_id').
    populate(populateoptions).exec(function(err, limit){
      if(err){
        next(err);
      }
      if(limit){
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify(utils.cleanObservations(limit, req.locale).limits, null, 2));
      } else {
        err = {
          code: 402,
          name: "codeInvalidError",
          message: "Invalid code"
        };
        next(err);
      }
    });
  };
  module.exports.postlimit = function(req, res, next) {
    var input = req.swagger.params.body.value;
    var _observations = [];
    async.each(input.limits,
      function(limit, callback){
        utils.createObservation(limit, req.user, 'Limit', function(err, output){
          if (!err){
            _observations.push(output);
          }
          callback();
        });
      }, function(err){
        if(err) next(err);
        var _final = models.Limit.model({
          name: input.name,
          limits: _observations,
          sources: input.sources || null,
          authority: input.authority || null
        });

        _final.save(function(err, result, count) {
          if (err) next(err);
          res.setHeader('content-type', 'application/json');
          res.setHeader('charset', 'utf-8');
          res.end(JSON.stringify({
            name: result.name
          }, null, 2));
        });
      }
    );
  };
}());
