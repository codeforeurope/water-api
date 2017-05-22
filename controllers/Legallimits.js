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
    select: 'value uom code -_id',
    match: { value: { $ne: null }},
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

  /**
   * Try to create an observation from the json object
   *
   * Requires a json object with 3 fields in the form of:
   * { "value": 10, "uom": "mg_l", "code": "natrium" }
   */
  var createObservation = function(jsonObject, user, callback){
    //get mgl
    var uom;
    var code;
    models.Uom.model.findOne({
      "code": jsonObject.uom
    }, function(err, _uom) {
      if(err) callback(err, null);
      uom = _uom;
      models.Code.model.findOne({code: jsonObject.code}, function(err, _code) {
        if (err) callback(err, null);
        code = _code;
        var _observation = models.Observation.model.create({
          value: jsonObject.value,
          uom: uom,
          code: code,
          entered_by: user
        }, function(err,result){
            if (err) callback(err);
            callback(null, result);
        });
      });
    });
  };

  /**
   * Transforms a limit from mongodb to a
   * Representation that can be sent as
   * a response.
   */
  var cleanLimit = function(source, locale){
    var output = source.toJSONLocalizedOnly(locale, 'en');
    output = utils.clean(output);
    var newlimits = [];

    for (var x in output.limits) {
      var cleanLimit = {
        uom: output.limits[x].uom.label,
        code: output.limits[x].code.label,
        value: output.limits[x].value
      };
      newlimits.push(cleanLimit);
    }
    output.limits = newlimits;
    return output;
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
        var output = cleanLimit(limits[limit], req.locale);
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
        res.end(JSON.stringify(cleanLimit(limit, req.locale).limits, null, 2));
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
    var _limits = [];
    async.each(input.limits,
      function(limit, callback){
        createObservation(limit, req.user, function(err, output){
          if(err) next(err);
          _limits.push(output);
          callback();
        });
      }, function(err){
        if(err) next(err);
        var _final = models.Limit.model({
          name: input.name,
          limits: _limits,
          sources: input.sources,
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
