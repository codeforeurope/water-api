(function () {
  'use strict'
  module.exports.gettap = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'GET'}, null, 2))
  }

  module.exports.posttap = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'POST'}, null, 2))
  }

  module.exports.puttap = function (req, res, next) {
    next(new Error('Not Implemented'))
  }
  module.exports.deletetap = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'DELETE'}, null, 2))
  }
})()
