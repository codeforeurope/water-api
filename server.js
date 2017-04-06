(function () {
  'use strict'

  var app = require('connect')()

  var swaggerTools = require('swagger-tools')
  var jsyaml = require('js-yaml')
  var fs = require('fs')
  var cors = require('cors')
  const auth0config = require('./config/auth0')
  const passport = require('passport')
  const jwt = require('express-jwt')
  const jwksRsa = require('jwks-rsa')
  const bodyParser = require('body-parser')

  var Auth0Strategy = require('passport-auth0')


  var strategy = new Auth0Strategy({
    domain: auth0config.base + '.auth0.com',
    clientID: auth0config.clientid,
    clientSecret: auth0config.clientsecret,
    callbackURL: '/auth'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile)
    }
  )

  passport.use(strategy)
  // var passport = require('passport'); var serveStatic =
  // require('serve-static'); swaggerRouter configuration
  var options = {
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
  }
  const checkJWT = jwt({
    // Dynamically provide a signing key based on the kid in the header and the
    // singing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
      cache: true, rateLimit: true, jwksRequestsPerMinute: 5,
      // Replace with your Auth0 Domain
      jwksUri: auth0config.baseurl + '.well-known/jwks.json'
    }),

    // Validate the audience and the issuer
    audience: auth0config.audience,
    // Replace with your Auth0 Domain
    issuer: auth0config.baseurl,
    algorithms: [auth0config.algorithms]
  })
  // Pass headers back headers: { authorization: 'Bearer ' + token +'\''} do check
  // on routes
  app.use(bodyParser.json({limit: '100kb'}))

  //  app.use('/api/auth', checkJWT)
  // swaggerUi.api.clientAuthorizations.add("key", new
  // SwaggerClient.ApiKeyAuthorization("Authorization", "XXXX", "header"));
  /*
//http://apprize.info/javascript/cors/8.html
// TODO CORS
// res.header('Access-Control-Allow-Headers', 'refreshToken,accessToken')
    res.header('Allow', 'OPTIONS,GET,PUT');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
*/
  app.use(cors()) // Allow Cross Origin Connections

  // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
  var spec = fs.readFileSync('./api/swagger.yaml', 'utf8')
  var swaggerDoc = jsyaml.safeLoad(spec)

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in
    // swagger-tools middleware chain
    /*
    const checkPermissions = function (req, res, next) {
      var permissions = ['user']
      if (['POST', 'PUT', 'DELETE'].indexOf(req.method) > -1) {
        permissions = ['admin']
      } else {}
      switch (req.path) {
        case '/api/company':
        default:
          {
            for (var i = 0; i < permissions.length; i++) {
              if (req.user.scope.includes(permissions[i])) {
                next()
              } else {
                res
                  .status(403)
                  .send({message: 'Forbidden'})
              }
            }
            break
          }
      }
    }
*/
    //    app.use(checkPermissions) old
    app
      .use(function (req, res, next) {
        if (['POST', 'PUT', 'DELETE'].indexOf(req.method) > -1) {
          res.setHeader('content-type', 'application/json')
          // check header or url parameters or post parameters for token
          var token = req.headers['x-access-token']
          // decode token
          if (token) {
            // console.log("Real tokens will come later, for now we accept!");
            req.token = token
            next()
          } else {
            // if there is no token return an error
            res.statusCode = 402
            res.end(JSON.stringify({
              'name': 'AuthenticationError',
              'message': 'No token provided'
            }, null, 2))
          }
        } else {
          next()
        }
      })

    app.use(middleware.swaggerMetadata())
    app.use('/auth', passport.authenticate('auth0', {failureRedirect: '/login'}), function (req, res) {
      if (!req.user) {
        throw new Error('user null')
      }
      res.redirect('/')
    })

    app.use('/login', passport.authenticate('auth0', {}), function (req, res) {
      res.redirect('/')
    })
    app.use('/login/google',
      passport.authenticate('auth0', {connection: 'google-oauth2'}), function (req, res) {
        res.redirect('/')
      }
    )
    /*
    app.get('/me', (req, res) => {
      res.json(req.user)
    })
    app.use(setupSwaggerSecurity(middleware))
    function setupSwaggerSecurity(middleware) {
      return middleware.swaggerSecurity({
        jwt_token: (req, authOrSecDef, scopes, callback) => {
          passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) callback(new Error('Error in passport authenticate'))
            if (!user) callback(new Error('Failed to authenticate oAuth token'))
            req.user = user
            return callback()
          })(req, null, callback)
        }
      })
    }
    */
    // Validate Swagger requests
    app.use(middleware.swaggerValidator())

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options))
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi())
    app.use(function onerror(err, req, res, next) {
      // an error occurred!
      res.setHeader('content-type', 'application/json')
      // result = {     "code": e.code || 400,     "message": e.name + " -- " +
      // e.message,     "fields": e.fields || null   };
      res.statusCode = err.code || 400
      res.end(JSON.stringify({
        'name': err.name,
        'message': err.message
      }, null, 2))
    })
  })
  module.exports = app
}())
