/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var models = require('../models');
  var utils = require('../helpers/util.js');
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
    // TODO
    next({
      code: 502,
      name: "NotImplementedError",
      message: 'Not Implemented'
    });
  };
}());
