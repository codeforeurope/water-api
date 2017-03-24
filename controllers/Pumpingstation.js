(function() {
    'use strict';
    module.exports.getpumpingstation = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "GET"}, null, 2));
    };

    module.exports.getpumpingstations = function(req, res, next) {
      // TODO
      next(new Error('Not Implemented'));
    };

    module.exports.postpumpingstation = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "POST"}, null, 2));
    };

    module.exports.putpumpingstation = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "PUT"}, null, 2));
    };
    module.exports.deletepumpingstation = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
    };
}());
