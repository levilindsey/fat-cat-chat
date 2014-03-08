// This module exposes the attachHandlers function, which attaches the route handlers for this app.

var ROUTE_REGEX = '*';
var TEMPLATE_FILE = '/templates/index';

var path = require('path');

var templatePath = null;

// Attaches route handlers to the server.
exports.attachHandlers = function attachHandlers(workingDirectory, server) {
  templatePath = path.resolve(workingDirectory + TEMPLATE_FILE);
  server.get(ROUTE_REGEX, handleRequest);
};

function handleRequest(req, res, next) {
  var content = {
  };
  res.render(templatePath, content);
}
