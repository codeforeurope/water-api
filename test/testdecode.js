// TODO Get auth code JWT token

// DECODE!

var jwtDecode = require('jwt-decode')

var token = 'eyJ0eXAiO.../// jwt token'

var decoded = jwt_decode(token)
console.log(decoded)
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
