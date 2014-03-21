// This module exposes the attachHandlers function, which attaches the route handlers for this app.

var ROUTE_REGEX, TEMPLATE_FILE, path, templatePath, port;

ROUTE_REGEX = '*';
TEMPLATE_FILE = '/templates/index';

path = require('path');

// Attaches route handlers to the server.
module.exports.attachHandlers = function attachHandlers(workingDirectory, server, serverPort) {
  port = serverPort;
  templatePath = path.resolve(workingDirectory + TEMPLATE_FILE);
  server.get(ROUTE_REGEX, handleRequest);
};

function handleRequest(req, res, next) {
  var content = {
    address: req.headers.host,
    port: port
  };
  res.render(templatePath, content);
}
