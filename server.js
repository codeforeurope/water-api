(function() {
    'use strict';
    var env = process.env.NODE_ENV || 'development';
    var config = require('./config/config.json')[env];
    var app = require('connect')();

    var swaggerTools = require('swagger-tools');
    var jsyaml = require('js-yaml');
    var fs = require('fs');
    var cors = require('cors');


    var options = {
        swaggerUi: '/swagger.json',
        controllers: './controllers',
        useStubs: env === 'development' ? true : false // Conditionally turn on stubs (mock mode)
    };

    var Locale = require('connect-locale');
    var localeOptions = {
        locales: config.locales,
        getLocaleFrom: ['query', 'accept-language'],
        storeLocaleTo: ['request']
    };

    app.use(cors()); //Allow Cross Origin Connections

    var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
      app.use(function (req, res, next) {
        if (['POST', 'PUT', 'DELETE'].indexOf(req.method) > -1) {
          res.setHeader('content-type', 'application/json');
          var token = req.headers['x-access-token'];
          if (token) {
            req.token = token;
            next();
          } else {
            next({
              code: 402,
              name: "AuthenticationError",
              message: "No token provided"
            });
          }
        } else {
          next();
        }
      });

      app.use(middleware.swaggerMetadata());
      app.use(middleware.swaggerValidator());
      app.use(Locale(localeOptions));
      app.use(middleware.swaggerRouter(options));
      app.use(middleware.swaggerUi());
      app.use(function onerror(err, req, res, next) {
        res.setHeader('content-type', 'application/json');
        res.statusCode = 400;
        if(err.code && err.code < 599 && err.code > 399){
          res.statusCode = err.code;
        }
        res.end(JSON.stringify({"name": err.name, "message": err.message}, null, 2));
      });
    });
    module.exports = app;
}());
