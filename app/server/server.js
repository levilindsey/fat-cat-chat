// This module exposes the run function, which creates the server
// instance, sets up the middleware, attaches the route handlers, and starts
// the server listening.

var BASE_DIR, express, aws, server, sockets, chatManager;

BASE_DIR = 'app';

express = require('express');
aws = require('aws-sdk');
sockets = require('./sockets');

chatManager = require('./chat/chatManager');
chatManager.socketManager.setBroadcastFunction(sockets.broadcast);
chatManager.socketManager.setUnicastFunction(sockets.unicast);

// Sets up and starts the server.
module.exports.run = function run(port) {
  // Initialize the HTTP server
  server = express();

  // Set up middleware
  require('./middleware').setMiddleware(BASE_DIR, server, express);

  // Configure AWS
  aws.config.loadFromPath(BASE_DIR + '/server/aws_config.json');

  // Attach route handlers
  require('./routes').attachHandlers(BASE_DIR, server, port);

  sockets.run(server, port, chatManager.socketManager.connectionHandler);

  return server;
};
