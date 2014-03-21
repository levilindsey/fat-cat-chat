// This script instantiates the socket handler and begins listening for connections.

var io;

module.exports.run = function run(server, port, connectionHandler) {
  io = require('socket.io').listen(server.listen(port, function() {
    console.log('Express and socket server listening on port ' + port);
  }));

  io.sockets.on('connection', connectionHandler);

  return io;
};

module.exports.broadcast = function(message) {
  io.sockets.emit('message', message);
};

module.exports.unicast = function(socket, message) {
  socket.emit('message', message);
};
