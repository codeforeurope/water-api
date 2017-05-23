(function () {
  'use strict';
  module.exports.getlocation = function(req, res, next) {
      var params = req.swagger.params;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({"operation": "GET"}, null, 2));
  };

  module.exports.postlocation = function(req, res, next) {
      var params = req.swagger.params;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({"operation": "POST"}, null, 2));
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
