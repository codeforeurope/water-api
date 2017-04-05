// TODO Get auth code JWT token

// DECODE!

var jwtDecode = require('jwt-decode')

var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik4wUTROamxHTlRCR01EVXhNems1TWpVNFF6WkVOemd3Tnprd1EwVkRRall5UXpoRU9EazVSZyJ9.eyJpc3MiOiJodHRwczovL3dhdGVyLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJJQ3FNQkZpOXJYWFZjSzBMcVVLRUxBZGpDVXcxNWUwZkBjbGllbnRzIiwiYXVkIjoiL2F1dGgiLCJleHAiOjE0OTE1MDA5MTksImlhdCI6MTQ5MTQxNDUxOSwic2NvcGUiOiIifQ.i5o941sQUTH4m2Xoh9b4VL_vv3hFOJH9hvEQFATykDJ552bK4AcCmEs9vVDc4Pi8Jw3ijcLfW10KoO65X-sztfF7-5eP9P9ConBXtdiZCRRpNx3Sv1NLjgFPLtmY95vNfMxXCiWDl--9hXnny8vTZ9sSfmL4a4uZE5MUGdqRiltAXbYWtCJ_8aYzz7BDAALSXRAQ4vB0jTiTXEqk0nYgDn7zozbxh6uLahJXxtfbjUgfe6s9fDiqvu2tNwwi5wVxJz64QoFjMa6AUYJO-RecoUhXlzp-1ixaG0RrCKVQkJbtS7rZHpvtw61zWRJh0LsjQsm32ClIfOn2pfpdD96d7A'
/*
var decoded = jwtDecode(token)
  describe('decode token', function () {
    it('it should equal  ', function (done) {
      
    }
  }
  */
/*
{ iss: 'https://water.eu.auth0.com/',
  sub: 'ICqMBFi9rXXVcK0LqUKELAdjCUw15e0f@clients',
  aud: '/auth',
  exp: 1491500919,
  iat: 1491414519,
  scope: '' }
*/


function randomString (length) {
  var bytes = new Uint8Array(length)
  var random = window.crypto.getRandomValues(bytes)
  var result = []
  var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
  random.forEach(function (c) {
    result.push(charset[c % charset.length])
  })
  return result.join('')
}
/*

window.localStorage.setItem('nonce', randomString(16));

var jwt = '...'; // validated and decoded ID token body
if (jwt.nonce === window.localStorage.getItem('nonce')) {
    // Nonce is OK
} else {
    // Nonce is not OK! Token replay attack might be underway
}
*/
/* prints:
 * { foo: "bar",
 *   exp: 1393286893,
 *   iat: 1393268893  }
 */
