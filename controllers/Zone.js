(function () {
  'use strict';
  var models = require('../models');
  var utils = require('../helpers/util.js');
  var async = require("async");


  var saveZone = function(params, callback){
    var tempzone = new models.Zone.model(params);
    tempzone.save(function (err, zone, count) {
      if(err){
        callback(err, null);
      } else {
        var final = {
          "name": zone.name,
          "id": zone._id
        };
        callback(null, final);
      }
    });
  };

  module.exports.getzone = function(req, res, next) {
    var params = req.swagger.params;
    var point = {
      type: "Point",
      coordinates: [ params.lon.value, params.lat.value ]
    };
    models.Zone.model.findOne().where('geometry').near({center: point, maxDistance:0}).
    exec(function(err, result){
      if(err){
        next(err);
      }
      var out = {};
      if(result){
        out = result.toJSONLocalizedOnly(req.locale, 'en');
        out = utils.clean(out, true);
      }
      res.setHeader('content-type', 'application/json');
      res.setHeader('charset', 'utf-8');
      res.end(JSON.stringify(out, null, 2));
    });
  };

  module.exports.postzone = function(req, res, next) {
    var params = req.swagger.params.body.value;
    params.entered_by = req.user;
    saveZone(params, function(err, result){
      res.setHeader('content-type', 'application/json');
      if (err) {
        if (err.code === 11000) {
          err = {
            code: 404,
            name: "duplicateError",
            message: "Zone exists"
          };
        }
        next(err);
      } else {
        res.end(JSON.stringify(result, null, 2));
      }
    });
  };

  module.exports.putzone = function(req, res, next) {
      next(new Error('Not Implemented'));
  };
  module.exports.deletezone = function(req, res, next) {
      var params = req.swagger.params;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
  };

  // Upload a json file with zones
  module.exports.postzones = function(req, res, next){
    var final;
    var params = req.swagger.params;
    if (params.file) {
      if(params.file.value.mimetype !== 'application/json' && params.file.value.mimetype !== 'application/geo+json'){
        next({
          "code": 404,
          "name": "InvalidMimeTypeError",
          "message": "Cannot process " + params.file.value.mimetype
        });
      } else {
        var data = JSON.parse(params.file.value.buffer);
        if(!data.features){
          next({
            "code": 404,
            "name": "noGeoJsonError",
            "message": "File contains no geojson features"
          });
        }
        var errors = [];
        var processed = [];
        async.each(data.features,
          function(feature, callback){
            feature.entered_by = req.user;
            feature.name = feature.properties.name;
            feature.alternatives = feature.properties.alternatives || null;
            saveZone(feature, function(err, output){
              if (!err){
                processed.push(output);
              } else {
                errors.push(err);
              }
              callback();
            });
          }, function(err){
            if(err) next(err);
            var final = {
              "errors": errors,
              "zones": processed
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
})();
