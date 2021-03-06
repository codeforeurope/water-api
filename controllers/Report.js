/**
 * Reports
 */
(function () {
  'use strict';
  var models = require('../models');
  var utils = require('../helpers/util.js');
  var moment = require('tz-business-time');
  var async = require("async");

  var saveReport = function(params, callback){
    var _observations = [];
    var _zones = [];
    var _plants = [];
    var _year;
    var _authority;
    var _operator;

    params.zones = params.zones || [];
    if(params.year){
      _year = moment(params.year, "YYYY").toDate();
    }
    if(params.zone){
      params.zones.push(params.zone);
    }

    async.each(params.observations,
      function(observation, cb2) {
        if(params.issued){
          observation.entered_at = params.issued;
        }
        utils.createObservation(observation, params.entered_by, 'Report', function(err, output) {
          // Do not handle the error, skip faulty Observations
          if (!err && output){
            _observations.push(output);
          }
          cb2();
        });
      }, function(err) {
        async.each(params.plants,
          function(plant, cb4) {
            var regex = new RegExp(["^", plant, "$"].join(""), "i");
            models.Location.model.findOne({name: regex}, function(err, output) {
              if(!err && output){
                _plants.push(output);
              }
              cb4();
            });
          }, function(err) {
            async.each(params.zones,
              function(zone, cb3) {
                models.Zone.model.findOne({name: zone}, function(err, output) {
                  if(!err && output){
                    _zones.push(output);
                  }
                  cb3();
                });
              }, function(err) {
                models.Company.model.findOne({code: params.authority}, function(err, output) {
                  if(err){
                    callback(err, null);
                  } else {
                    _authority = output;
                    models.Company.model.findOne({code: params.operator}, function(err, output2) {
                      if(err){
                        callback(err, null);
                      } else {
                        _operator = output2;
                        var _report = {
                          name: params.name,
                          observations: _observations,
                          sources: params.sources,
                          authority: _authority,
                          operator: _operator,
                          year: _year,
                          zones: _zones,
                          plants: _plants,
                          entered_by: params.entered_by
                        };
                        models.Report.model.create(_report, function(err, result) {
                          if (err) {
                            callback(err, null);
                          } else {
                            callback(null,{
                              name: result.name,
                              id: result._id
                            });
                          }
                        });
                      }
                    });
                  }
                }
              );
            });
          });
    });
  };

  // Options for the mongoose query
  var populateoptions = [
    {
      path: 'plants',
      model: 'Location',
      select: 'name description geometry type access-_id'
    }, {
      path: 'authority',
      model: 'Company',
      select: 'name url type -_id'
    }, {
      path: 'operator',
      model: 'Company',
      select: 'name url type -_id'
    }, {
    path: 'observations',
    select: 'value uom code -_id',
    populate: [{
      path: 'uom',
      model: 'Uom',
      select: 'label code -_id'
    },{
      path: 'code',
      model: 'Code',
      select: 'label description -_id'
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
        sort({"issued": -1, "year": -1}).
        select('name authority operator observations plants year').
        populate(populateoptions).exec(function(err, report){
          if(err){
            next(err);
          }
          if(report){
            var _year = moment(report.year).local().format("YYYY");
            out = utils.cleanObservations(report, req.locale);
            out.year = _year;
            if(params.geometry.value){
              out.zone = {
                "type": "Feature",
                "properties":{
                  id: zone._id,
                  name: zone.name,
                  alternatives: zone.alternatives
                },
                geometry: zone.geometry,
              };
              var tempplants = [];
              if(out.plants){
                for (var i=0; i<out.plants.length; i++) {
                  var tempplant = {
                    type: "Feature",
                    properties: {
                      "name": out.plants[i].name,
                      "access": out.plants[i].access,
                      "type": out.plants[i].type
                    },
                    geometry: out.plants[i].geometry
                  };
                  tempplants.push(tempplant);
                }
              }
              out.plants = tempplants;
            } else {
              delete out.zone;
              delete out.plants;
            }

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
    var params = req.swagger.params.body.value;
    params.entered_by = req.user;
    saveReport(params, function(err, result){
      res.setHeader('content-type', 'application/json');
      res.setHeader('charset', 'utf-8');
      if (err) {
        if (err.code === 11000) {
          err = {
            code: 404,
            name: "duplicateError",
            message: "Report exists"
          };
        }
        next(err);
      } else {
        res.end(JSON.stringify(result, null, 2));
      }
    });
  };

  // Upload a json file with zones
  module.exports.postreports = function(req, res, next){
    var final;
    var params = req.swagger.params;
    if (params.file) {
      if(params.file.value.mimetype !== 'application/json'){
        next({
          "code": 404,
          "name": "InvalidMimeTypeError",
          "message": "Cannot process " + params.file.value.mimetype
        });
      } else {
        var data = JSON.parse(params.file.value.buffer);
        if(!Array.isArray(data)){
          next({
            "code": 404,
            "name": "noArrayJsonError",
            "message": "File should contain an array"
          });
        }
        var errors = [];
        var processed = [];
        async.each(data,
          function(report, callback){
            report.entered_by = req.user;
            saveReport(report, function(err, output){
              if (!err){
                processed.push(output);
              } else {
                errors.push({"name": err.name,"message": err._message});
              }
              callback();
            });
          }, function(err){
            if(err) next(err);
            var final = {
              "errors": errors,
              "reports": processed
            };
            res.setHeader('content-type', 'application/json');
            res.setHeader('charset', 'utf-8');
            res.end(JSON.stringify(final, null, 2));
          }
        );
      }
    } else {
      next({
        "code": 404,
        "name": "UploadError",
        "message": "No file attached"
      });
    }
  };
}());
