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
    path: 'observations',
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

  module.exports.getproducts = function (req, res, next) {
    var params = req.swagger.params;
    //find a limit from the database
    models.Product.model.find().
    select('name vendor sources observations -_id').
    populate(populateoptions).exec(function(err, products){
      var final = [];
      if(err){
        next(err);
      }

      for (var x in products) {
        var output = utils.cleanObservations(products[x], req.locale);
        final.push(output);
      }

      res.setHeader('content-type', 'application/json');
      res.setHeader('charset', 'utf-8');
      res.end(JSON.stringify(final, null, 2));
    });
  };

  module.exports.getproduct = function (req, res, next) {
    var params = req.swagger.params;
    //find a limit from the database
    models.Product.model.findOne({name: params.code.value}).
    select('name vendor sources observations -_id').
    populate(populateoptions).exec(function(err, product){
      if(err){
        next(err);
      }
      if(product){
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify(utils.cleanObservations(product, req.locale), null, 2));
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
  module.exports.postproduct = function(req, res, next) {
    var input = req.swagger.params.body.value;
    var _observations = [];
    async.each(input.observations,
      function(observation, callback) {
        utils.createObservation(observation, req.user, 'Label', function(err, output){
          if (!err){
            _observations.push(output);
          }
          callback();
        });
      }, function(err) {
        // Get the vendor, it should be an existing company
        models.Company.model.findOne({code: input.vendor}, function(err, _vendor) {

        models.Product.model.create({
          name: input.name,
          observations: _observations,
          sources: input.sources,
          vendor: _vendor || null,
          volume: input.volume || null,
          entered_by: req.user
        }, function(err, result) {
          if (err) next(err);
          res.setHeader('content-type', 'application/json');
          res.setHeader('charset', 'utf-8');
          res.end(JSON.stringify({
            name: result.name
          }, null, 2));
        });
      });
    });
  };
}());
