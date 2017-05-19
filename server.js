(function() {
    'use strict';

    var app = require('connect')();

    var swaggerTools = require('swagger-tools');
    var jsyaml = require('js-yaml');
    var fs = require('fs');
    var cors = require('cors');
    var options = {
        swaggerUi: '/swagger.json',
        controllers: './controllers',
        useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
    };

    app.use(cors()); //Allow Cross Origin Connections

    var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
        app.use(middleware.swaggerMetadata());
        app.use(middleware.swaggerValidator());
        app.use(middleware.swaggerRouter(options));
        app.use(middleware.swaggerUi());
        app.use(function onerror(err, req, res, next) {
          res.setHeader('content-type', 'application/json');
          res.statusCode = err.code || 400;
          res.end(JSON.stringify({"name": err.name, "message":err.message}, null, 2));
        });
    });
    module.exports = app;
}());
