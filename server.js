(function() {
    'use strict';

    var app = require('connect')();

    var swaggerTools = require('swagger-tools');
    var jsyaml = require('js-yaml');
    var fs = require('fs');
    var cors = require('cors');
    //var passport = require('passport');

    //var serveStatic = require('serve-static');
    // swaggerRouter configuration
    var options = {
        swaggerUi: '/swagger.json',
        controllers: './controllers',
        useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
    };

    app.use(cors()); //Allow Cross Origin Connections

    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(function(req, res, next){
          if(['POST','PUT','DELETE'].indexOf(req.method) > -1){
            res.setHeader('content-type', 'application/json');
            // check header or url parameters or post parameters for token
            var token = req.headers['x-access-token'];
            // decode token
            if (token) {
              console.log("Real tokens will come later, for now we accept!");
              req.decoded = true;
              next();
            } else {
              // if there is no token
              // return an error
              res.statusCode = 402;
              res.end(JSON.stringify({"name": "AuthenticationError", "message": "No token provided"}, null, 2));
            }
          } else {
            next();
          }
        });

        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator());

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));

        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());
        app.use(function onerror(err, req, res, next) {
          // an error occurred!
          res.setHeader('content-type', 'application/json');
          // result = {
          //     "code": e.code || 400,
          //     "message": e.name + " -- " + e.message,
          //     "fields": e.fields || null
          //   };
          res.statusCode = err.code || 400;
          res.end(JSON.stringify({"name": err.name, "message":err.message}, null, 2));
        });
    });
    module.exports = app;
}());
