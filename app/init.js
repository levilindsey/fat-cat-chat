// This script instantiates the server and begins listening for requests.

var PORT = process.env.PORT || 3000;

var server = require('./server/server').createServer();

server.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});
