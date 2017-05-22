(function() {
    'use strict';
    var models = require('../models');
    var Company = models.Company;

    module.exports.getcompanies = function(req, res, next) {
      var params = req.swagger.params;
      models.Company.model.find().
      select('code name -_id').
      exec(function(err, companies){
        if(err){
          next(err);
        }
        //i18n them!
        var final = [];

        for (var x in companies) {
          final.push(companies[x].toJSONLocalizedOnly(req.locale, 'en'));
        }
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify(final, null, 2));
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
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset', 'utf-8');
        res.end(JSON.stringify(company.toJSONLocalizedOnly(req.locale, 'en'), null, 2));
      });
    };
    module.exports.postcompany = function(req, res, next) {
      var params = req.swagger.params.body.value;
      var code = params.code || params.name.replace(/[`~!@#$%^&*()\ \_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase();
      var tempcompany = new Company.model({
        code: code,
        name: params.name,
        url: params.url || null,
        country: params.country || null,
        entered_by: req.user
      });
      tempcompany.save(function (err, company, count) {
        res.setHeader('content-type', 'application/json');
        if (err) {
          if (err.code === 11000) {
            err = {
              code: 404,
              name: "duplicateError",
              message: "Company exists"
            };
          }
          next(err);
        } else {
          res.end(JSON.stringify(company, null, 2));
        }
      });
    };

    module.exports.putcompany = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "PUT"}, null, 2));
    };
    module.exports.deletecompany = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
    };
}());
