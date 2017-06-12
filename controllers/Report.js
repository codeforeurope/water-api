/**
 * Contains legal limits per standard regarding water quality
 * For guage.js
 */
(function () {
  'use strict';
  var async = require("async");
  var models = require('../models');
  var utils = require('../helpers/util.js');
  var moment = require('tz-business-time');
  // Options for the mongoose query
  var populateoptions = [{
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
  }];
  module.exports.getreport = function(req, res, next) {
    var params = req.swagger.params;
    var point = {
      type: "Point",
      coordinates: [ params.lon.value, params.lat.value ]
    };
    var zone;
    var out = {};

    models.Zone.model.findOne().where('geometry').near({center: point, maxDistance:0}).
    exec(function(err, result){
      if(err){
        next(err);
      }
      if(result) {
        zone = result;
        //get the report for this zone
        models.Report.model.findOne().where({'zones': {$in: [result._id] }}).
        select('name authority observations year').
        populate(populateoptions).exec(function(err, report){
          if(err){
            next(err);
          }
          if(report){
            var _year = moment(report.year).local().format("YYYY");
            out = utils.cleanObservations(report, req.locale);
            out.year = _year;
            out.zone = {name: zone.name, id: zone._id};
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(out, null, 2));
          } else {
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(out, null, 2));
          }
        });
      } else {
        //return empty for now
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify({}, null, 2));
      }
    });
  };

  /**
   * Post a report.
   */
  module.exports.postreport = function(req, res, next) {
    var input = req.swagger.params.body.value;
    var _observations = [];
    var _zones = [];
    var _year;
    var _authority;

    input.zones = input.zones || [];
    if(input.year){
      _year = moment(input.year, "YYYY").toDate();
    }
    if(input.zone){
      input.zones.push(input.zone);
    }

    async.each(input.observations,
      function(observation, callback) {
        utils.createObservation(observation, req.user, 'Zone', function(err, output) {
          // Do not handle the error, skip faulty Observations
          if (!err){
            _observations.push(output);
          }
          callback();
        });
      },
      function(err) {
        async.each(input.zones,
          function(zone, callback) {
            models.Zone.model.findOne({name: zone}, function(err, output) {
              if(!err){
                _zones.push(output);
              }
              callback();
            });
          },
          function(err){
            models.Company.model.findOne({code: input.authority}, function(err, output) {
              if(err){
                next(err);
              } else {
                _authority = output;
              }
              models.Report.model.create({
                name: input.name,
                observations: _observations,
                sources: input.sources || null,
                authority: _authority || null,
                year: _year || null,
                zones: _zones,
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
            }
          );
        });
    });
  };
}());
