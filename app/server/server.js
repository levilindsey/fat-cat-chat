// This module exposes the createServer function, which creates the server 
// instance, sets up the middleware, and attaches the route handlers.

var BASE_DIR = 'app';

var express = require('express');
var aws = require('aws-sdk');

var routes = require('./routes');
var middleware = require('./middleware');

// Sets up the server.
exports.createServer = function createServer() {
  var server;

  // Initialize the HTTP server
  server = express();

  // Set up middleware
  middleware.setMiddleware(BASE_DIR, server, express);

  // Configure AWS
  aws.config.loadFromPath(BASE_DIR + '/server/aws_config.json');

  // Attach route handlers
  routes.attachHandlers(BASE_DIR, server);

  return server;
};
