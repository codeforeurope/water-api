(function () {
  'use strict';
  var models = require('../models');
  var utils = require('../helpers/util.js');

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
    var tempzone = new models.Zone.model(params);
    tempzone.save(function (err, zone, count) {
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
        zone = {
          "name": zone.name,
          "id": zone._id
        };
        res.end(JSON.stringify(zone, null, 2));
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
})();
