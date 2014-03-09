// This module exposes the setMiddleware function, which sets up all of the
// middleware functionality for the server.

var BASE_DIR = '../../';

// Sets up the middleware for the server.
exports.setMiddleware = function setMiddleware(workingDirectory, server, express) {
  // Set up the templating engine
  server.set('views', __dirname);
  server.set('view engine', 'jade');

  server.use(express.logger('dev'));
  server.use(express.favicon());
  server.use(express.json());
  server.use(express.urlencoded());
  server.use(express.methodOverride());

  setUpStaticFiles(workingDirectory, server, express);
  server.use(server.router);

  // development only
  if (server.get('env') === process.env.NODE_ENV) {
    server.use(express.errorHandler());
  } 
};

// Set up the static files.
function setUpStaticFiles(workingDirectory, server, express) {
  var staticPath;

  // Set up the home files
  staticPath = __dirname + '/' + BASE_DIR + workingDirectory + '/client';
  server.use('/', express.static(staticPath));
  console.log('Serving static files: staticPath=' + staticPath);
}
