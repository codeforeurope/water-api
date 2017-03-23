var app = require('./server');
var http = require('http');
var serverPort = 8080;
http.createServer(app).listen(serverPort, function() {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
