// This script instantiates the server and begins listening for requests.

var PORT = process.env.PORT || 3000;

require('./server/server').run(PORT);
