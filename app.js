const restify = require('restify');
const restifySwagger = require('node-restify-swagger');
const restifyValidation = require('node-restify-validation');
const pkg = require('./package.json');
const debug = require('debug')(pkg.name);
//var fs = require('fs');

const redirectIfHtmlRequest = (url) => (req, res, next) =>
  res.redirect(url, next);

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  return port >= 0 ? port : false;
};

const onError = (port) => (req, res, error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    break;

    default:
      throw error;
  }
};

const onListening = (server) => () => {
  var addr = server.address();

  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  debug('Server listening on ' + bind);
  console.log('Server listening on ' + bind);
};

const server = restify.createServer({
  //certificate: fs.readFileSync('path/to/server/certificate'),
  //key: fs.readFileSync('path/to/server/key'),
  name: pkg.name,
  //spdy: {},
  version: pkg.version,
});

server.use(restify.acceptParser(server.acceptable));
//server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
//server.use(restify.requestExpiry());
/*
server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true,
  overrides: {
    '192.168.1.1': {
      rate: 0,        // unlimited
      burst: 0
    }
  }
}));
*/
server.use(restify.conditionalRequest());

// fix for known curl issue
server.pre(restify.pre.userAgentConnection());

server.use(restifyValidation.validationPlugin({
  errorsAsArray: false,
}));

restifySwagger.configure(server, {
  allowMethodInModelNames: true,
});

server.get('/', redirectIfHtmlRequest('/rsr/'));
require('./routes/calculate')(server);
server.get('/result/:id', require('./routes/result'));
server.get('/drug', require('./routes/drug'));
server.get('/offenceType', require('./routes/offenceType'));
server.get('/violentOffenceCategory', require('./routes/violentOffenceCategory'));

server.post('/ping', require('./routes/ping'));
server.post('/healthcheck', require('./routes/healthcheck'));

server.get(/^\/rsr\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html',
}));

// environment variables
var port = normalizePort(process.env.PORT || '3030');
server.on('InternalServer',    onError(port));
server.on('listening',   onListening(server));

restifySwagger.loadRestifyRoutes();
server.listen(port);
