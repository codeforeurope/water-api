/**
 * Contains legal values per norm regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');

  // Options for the mongoose query
  var populateoptions = {
    path: 'observations',
    select: 'value min max uom code -_id',
    populate: [{
      path: 'uom',
      model: 'Uom',
      select: 'label code -_id'
    },{
      path: 'code',
      model: 'Code',
      select: 'label -_id'
    }]
  };

  module.exports.getnorms = function (req, res, next) {
    var params = req.swagger.params;
    var flatten;
    if(req.swagger.apiPath.indexOf('/limits') != -1){
      flatten = true;
    }
    //find a norm from the database
    models.Norm.model.find().
    select('name authority sources observations -_id').
    populate(populateoptions).exec(function(err, norms){
      var final = [];
      if(err){
        next(err);
      }

      for (var y in norms) {
        var output = utils.cleanObservations(norms[y], req.locale, flatten);
        final.push(output);
      }

      res.setHeader('content-type', 'application/json');
      res.setHeader('charset', 'utf-8');
      res.end(JSON.stringify(final, null, 2));
    });
  };

  module.exports.getnorm = function (req, res, next) {
    var params = req.swagger.params;
    var flatten;
    if(req.swagger.apiPath.indexOf('/limit') != -1){
      flatten = true;
    }
    //find a norm from the database
    models.Norm.model.findOne({name: params.code.value}).
    select('name authority sources observations -_id').
    populate(populateoptions).exec(function(err, norm){
      if(err){
        next(err);
      }
      if(norm){
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify(utils.cleanObservations(norm, req.locale, flatten).observations, null, 2));
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
  module.exports.postnorm = function(req, res, next) {
    var input = req.swagger.params.body.value;
    var _observations = [];
    async.each(input.observations,
      function(observation, callback){
        utils.createObservation(observation, req.user, 'Norm', function(err, output){
          if (!err){
            _observations.push(output);
          }
          callback();
        });
      }, function(err){
        if(err) next(err);
        var _final = models.Norm.model({
          name: input.name,
          observations: _observations,
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
