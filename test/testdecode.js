// TODO Get auth code JWT token
// Encode 
const auth0config = require('../config/auth0')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
var x = jwt({
    // Dynamically provide a signing key based on the kid in the header and the
    // singing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      // Replace with your Auth0 Domain
      jwksUri: auth0config.baseurl + '.well-known/jwks.json'
    }),

    // Validate the audience and the issuer
    audience: auth0config.audience,
    // Replace with your Auth0 Domain
    issuer: auth0config.baseurl,
    algorithms: [auth0config.algorithms]
  })
console.log( x)
// DECODE!
/*
// verify a token symmetric - synchronous
var decoded = jwt.verify(token, 'shhhhh');
console.log(decoded.foo) // bar

// verify a token symmetric
jwt.verify(token, 'shhhhh', function(err, decoded) {
  console.log(decoded.foo) // bar
});

// invalid token - synchronous
try {
  var decoded = jwt.verify(token, 'wrong-secret');
} catch(err) {
  // err
}

// invalid token
jwt.verify(token, 'wrong-secret', function(err, decoded) {
  // err
  // decoded undefined
});

// verify a token asymmetric
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, function(err, decoded) {
  console.log(decoded.foo) // bar
});

// verify audience
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo' }, function(err, decoded) {
  // if audience mismatch, err == invalid audience
});

// verify issuer
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer' }, function(err, decoded) {
  // if issuer mismatch, err == invalid issuer
});

// verify jwt id
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid' }, function(err, decoded) {
  // if jwt id mismatch, err == invalid jwt id
});

// verify subject
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid', subject: 'subject' }, function(err, decoded) {
  // if subject mismatch, err == invalid subject
});

// alg mismatch
var cert = fs.readFileSync('public.pem'); // get public key
jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
  // if token alg != RS256,  err == invalid signature
});
*/
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
