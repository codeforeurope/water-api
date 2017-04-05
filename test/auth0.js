var request = require('request')
var config = require('../config/auth0')

var options = { method: 'POST',
  url: config.tokenurl,
  headers: { 'content-type': 'application/json' },
  body:
  { grant_type: 'client_credentials',
    client_id: config.clientid,
    client_secret: config.clientsecret,
    audience: config.audience },
  json: true }
// TODO ERROR uri: options.url + '/get'
// request.uri = options.url + '/get'
request(options, function (error, response, body) {
  if (error) throw new Error(error)

  console.log(body)
})
