(function () {
  'use strict';
  var models = require('../models');
  var utils = require('../helpers/util.js');
  var async = require("async");

  var saveLocation = function(params, callback){
    if(!params.operator){
      var tempLocation = new models.Location.model(params);
      tempLocation.save(function (err, location, count) {
        if(err){
          callback(err, null);
        } else {
          var final = {
            "name": location.name,
            "id": location._id
          };
          callback(null, final);
        }
      });
    } else {
      models.Company.model.findOne({code: params.operator}, function(err, output) {
        if(err) {
          callback(err, null);
        } else {
          params.operator = output;
          var tempLocation = new models.Location.model(params);
          tempLocation.save(function (err, location, count) {
            if(err){
              callback(err, null);
            } else {
              var final = {
                "name": location.name,
                "id": location._id
              };
              callback(null, final);
            }
          });
        }
      });
    }
  };

  module.exports.getlocation = function(req, res, next) {
      var params = req.swagger.params;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({"operation": "GET"}, null, 2));
  };

  // Upload a json file with locations
  module.exports.postlocations = function(req, res, next){
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
            feature.type = feature.properties.type;
            feature.operator = feature.properties.operator;
            feature.operator_id = feature.properties.id;
            feature.description = feature.properties.description;
            saveLocation(feature, function(err, output){
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
              "locations": processed
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

  module.exports.putlocation = function(req, res, next) {
      next(new Error('Not Implemented'));
  };
  module.exports.deletelocation = function(req, res, next) {
      var params = req.swagger.params;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
  };
})();
