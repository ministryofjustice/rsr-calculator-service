const restify = require('restify');
const pkg = require('./package.json');
const Logger = require('bunyan');
const app = require('./app');

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  return port >= 0 ? port : false;
};

const onError = (port, logger) => (req, res, error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
    break;

    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
    break;

    default:
      throw error;
  }
};

const onListening = (server, logger) => () => {
  var addr = server.address();

  logger.info({addr}, 'Server listening');
};

// environment variables
const port = normalizePort(process.env.PORT || '3000');

const logger = new Logger({
  name: pkg.name + ':server',
  streams: [
    {
      stream: process.stdout,
      level: 'debug',
    }
  ],
  serializers: restify.bunyan.serializers,
});

process.on('uncaughtException', logAndAbort);
process.on('unhandledRejection', logAndAbort);
function logAndAbort(err) {
  logger.error(err, 'Unhandled error');
  process.exit(1);
}

const server = app(process.env, logger);

// start server
server.listen(port);
server.on('InternalServer',    onError(port, logger));
server.on('listening',   onListening(server, logger));
server.on('after', restify.auditLogger({ log:logger }));
