/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var models = require('../models');
  var utils = require('../helpers/util.js');
  module.exports.getlimits = function (req, res, next) {
    var params = req.swagger.params;
    //find a limit from the database
    models.Limit.model.find().
    select('name authority sources limits -_id').
    populate({
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
    }).exec(function(err, limits){
      var final = [];
      if(err){
        err = {
          code: 404,
          name: "tokenInvalidError",
          message: "Invalid token"
        };
        next(err);
      }

      for (var limit in limits) {
        var output = limits[limit].toJSONLocalizedOnly('en','en');
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
        final.push(output);
      }

      res.setHeader('content-type', 'application/json');
      res.setHeader('charset', 'utf-8');
      res.end(JSON.stringify(final, null, 2));
    });
  };
}());
