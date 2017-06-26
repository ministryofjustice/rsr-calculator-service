const path = require('path');

const restify = require('restify');
const SwaggerRestify = require('swagger-restify-mw');
const setupAuth = require('../api/helpers/auth.js');

var swaggerConfig = {
  appRoot: path.resolve(__dirname, '..')
};

const getServerOptions = (config, log) => {
  var options = {
    name: config.name,
    version: config.version,
    log,
    handleUncaughtExceptions: false,
  };

  return options;
};

const createServer = (config, log) => {
  return restify.createServer(getServerOptions(config, log));
};

const setupMiddleware = (server) => {
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.authorizationParser());
  server.use(restify.dateParser());
  server.use(restify.queryParser());
  server.use(restify.gzipResponse());
  server.use(restify.bodyParser());
  server.use(restify.conditionalRequest());

  // fix for known curl issue
  server.pre(restify.pre.userAgentConnection());

  return server;
};

module.exports = (config, log, callback) => {
  var server = createServer(config, log);
  server = setupMiddleware(server);
  server = setupAuth(server, config.auth, log);

  server.on('after', restify.auditLogger({log}));
  server.on('uncaughtException', function (req, res, route, err) {
    log.warn(err);
    res.send(new restify.InternalError(err, err.message || 'unexpected error'));
  });

  SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
    if (err) {
      throw err;
    }

    // install middleware
    swaggerRestify.register(server);

    callback(null, server);
  });
};
