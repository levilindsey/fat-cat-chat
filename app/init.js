// This script instantiates the server and begins listening for requests.

var PORT = 8080;

var server = require('./server/server').createServer();

server.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});
