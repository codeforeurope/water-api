/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');

  /**
   * Post a report.
   */
  module.exports.postreport = function(req, res, next) {
    var input = req.swagger.params.body.value;
    var _observations = [];
    async.each(input.observations,
      function(observation, callback) {
        utils.createObservation(observation, req.user, 'Zone', function(err, output){
          // Do not handle the error, skip faulty Observations
          if (!err){
            _observations.push(output);
          }
          callback();
        });
      },
      function(err) {
        // Get the zone and then the authority, it should be an existing company
        models.Zone.model.findOne({code: input.zone}, function(err, _zone){
          if(err){
            next(err);
          }
          models.Company.model.findOne({code: input.authority}, function(err, _authority) {
            if(err){
              next(err);
            }
            models.Report.model.create({
              name: input.name,
              observations: _observations,
              sources: input.sources || null,
              authority: _authority || null,
              zone: _zone,
              entered_by: req.user
            }, function(err, result) {
              if (err) next(err);
              res.setHeader('content-type', 'application/json');
              res.setHeader('charset', 'utf-8');
              res.end(JSON.stringify({
                name: result.name,
                id: result._id
              }, null, 2));
            });
          });
        });
      }
    );
  };
}());
