(function() {
    'use strict';
    var models = require('../models');
    var utils = require('../helpers/util.js');

    module.exports.getcompanies = function(req, res, next) {
      models.Company.model.find().
      select('name').
      exec(function(err, companies){
        if(err){
          next(err);
        }
        //i18n them!
        var final = [];

        for (var x in companies) {
          final.push(utils.clean(companies[x].toJSONLocalizedOnly(req.locale, 'en'), true));
        }
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify(final, null, 2));
      });
    };

    module.exports.getcompanybyid = function(req, res, next) {
      var params = req.swagger.params;
      models.Company.model.findById(params.id.value).
      select('code name url country -_id').
      exec(function(err, company){
        if(err){
          next(err);
        }
        if(company){
          res.setHeader('content-type', 'application/json');
          res.setHeader('charset', 'utf-8');
          res.end(JSON.stringify(company.toJSONLocalizedOnly(req.locale, 'en'), null, 2));
        } else {
          err = {
            code: 404,
            name: "notFound",
            message: "Company not found"
          };
          next(err);
        }
      });
    };
    module.exports.getcompany = function(req, res, next) {
      var params = req.swagger.params;
      models.Company.model.findOne({code: params.code.value }).
      select('code name url country -_id').
      exec(function(err, company){
        if(err){
          next(err);
        }
        if(company){
          res.setHeader('content-type', 'application/json');
          res.setHeader('charset', 'utf-8');
          res.end(JSON.stringify(company.toJSONLocalizedOnly(req.locale, 'en'), null, 2));
        } else {
          err = {
            code: 404,
            name: "notFound",
            message: "Company not found"
          };
          next(err);
        }
      });
    };
    module.exports.postcompany = function(req, res, next) {
      var params = req.swagger.params.body.value;
      var code = params.code || params.name.replace(/[`~!@#$%^&*()\ \_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase();
      var tempcompany = new models.Company.model({
        code: code,
        name: params.name,
        url: params.url || null,
        country: params.country || null,
        type: params.type || 'unknown',
        entered_by: req.user
      });
      tempcompany.save(function (err, company, count) {
        if (err) {
          if (err.code === 11000) {
            err = {
              code: 405,
              name: "duplicateError",
              message: "Company exists"
            };
          }
          next(err);
        } else {
          res.setHeader('content-type', 'application/json');
          res.setHeader('charset', 'utf-8');
          res.end(JSON.stringify(company, null, 2));
        }
      });
    };

    module.exports.putcompany = function(req, res, next) {
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify({"operation": "PUT"}, null, 2));
        next();
    };
    module.exports.deletecompany = function(req, res, next) {
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
        next();
    };
}());
