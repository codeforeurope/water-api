var request = require('request')
require('dotenv-safe').config({

}
)

var options = { method: 'POST',
  url: process.env.TOKEN_URL,
  headers: { 'content-type': 'application/json' },
  body:
  { grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: process.env.AUDIENCE },
  json: true }

request(options, function (error, response, body) {
  if (error) throw new Error(error)

  console.log(body)
})
