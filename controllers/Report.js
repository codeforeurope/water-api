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
    path: 'zone',
    select: 'name -_id'
  },{
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
    var zone = {};
    models.Zone.model.findOne().where('geometry').near({center: point, maxDistance:0}).
    exec(function(err, result){
      if(err){
        next(err);
      }
      var out = {};
      if(result) {
        models.Report.model.findOne().where({'zone': result._id }).
        select('name authority zone observations year').
        populate(populateoptions).exec(function(err, report){
          if(err){
            next(err);
          }
          if(report){
            var _year = moment(report.year).local().format("YYYY");
            out = utils.cleanObservations(report, req.locale);
            out.year = _year;
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(out, null, 2));
          } else {
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(out, null, 2));
          }
        });
        //get the report for this zone
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
    var zone;
    var authority;
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
        var year;
        models.Zone.model.findById(input.zone, function(err, _zone){
          if(err){
            next(err);
          } else {
            zone = _zone;
          }
          models.Company.model.findOne({code: input.authority}, function(err, _authority) {
            if(err){
              next(err);
            } else {
              authority = _authority;
            }
            if(input.year){
              year = moment(input.year, "YYYY").toDate();
            }
            models.Report.model.create({
              name: input.name,
              observations: _observations,
              sources: input.sources || null,
              authority: authority || null,
              year: year || null,
              zone: zone || null,
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
