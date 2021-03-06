(function () {
  'use strict';
  var models = require('../models');

  module.exports.postuom = function(req, res, next) {
    var input = req.swagger.params.body.value;
    input.entered_by = req.user;
    models.Uom.model.create(input, function(err, result) {
      if (err) {
        next(err);
      } else {
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify({
          code: result.code,
          id: result._id
        }, null, 2));
      }
    });
  };
}());
