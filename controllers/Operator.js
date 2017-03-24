(function() {
    'use strict';
    module.exports.getoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "GET"}, null, 2));
    };

    module.exports.postoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "POST"}, null, 2));
    };

    module.exports.putoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "PUT"}, null, 2));
    };
    module.exports.deleteoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
    };
}());
