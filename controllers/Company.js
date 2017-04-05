(function () {
  'use strict'
  var models = require('../models')
  var Company = models.Company
  module.exports.getcompany = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'GET'}, null, 2))
  }

  module.exports.postcompany = function (req, res, next) {
    var params = req.swagger.params.body.value
    var code = params.code || params.name.replace(/[`~!@#$%^&*()\ \_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase()
      // Find user by token.
    models.User.model.findOne({ 'token': req.token }, function (err, user) {
      var tempcompany = new Company.model({
        code: code,
        name: params.name,
        url: params.url || null,
        country: params.country || null,
        entered_by: user
      })
      tempcompany.save(function (err, company, count) {
        res.setHeader('content-type', 'application/json')
        if (err) {
          next(err)
        } else {
          res.end(JSON.stringify(company, null, 2))
        }
      })
      if (err) {
        res.send('404', 'ERROR:Company not found')
        // next(err)
      }
    })
  }

  module.exports.putcompany = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'PUT'}, null, 2))
  }
  module.exports.deletecompany = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'DELETE'}, null, 2))
  }
}())
