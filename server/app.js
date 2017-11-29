const express = require('express');
const bunyanMiddleware = require('bunyan-middleware');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const xFrameOptions = require('x-frame-options');
const requireAll = require('require-all');

const auth = require('./apiKeyAuth');
const errors = require('./errors');
const healthcheck = require('../api/health/healthcheck');

const flatten = (data) => {
  let result = {};

  let recurse = (cur, prop) => {
    let isEmpty = true;

    for (let p in cur) {
      isEmpty = false;
      recurse(cur[p], prop + (!~p.indexOf('index') ? '/' + p : ''));
    }

    if (typeof cur === 'function') {
      result[prop] = cur;
    } else if (isEmpty && prop) {
      result[prop] = {};
    }
  };

  recurse(data, '');

  return result;
};

module.exports = (config, log, callback, includeErrorHandling = true) => {
  const app = express();
  app.locals.config = config;

  app.set('json spaces', 2);
  app.set('trust proxy', true);

  setupBaseMiddleware(app, log);
  setupOperationalRoutes(app);
  setupStaticRoutes(app);
  setupAuthMiddleware(app, log);
  setupRouters(app, log);

  if (includeErrorHandling) {
    setupErrorHandling(app, config);
  }

  return callback(null, app);
};

function setupBaseMiddleware(app, log) {
  app.use(bunyanMiddleware({
    logger: log,
    obscureHeaders: ['Authorization'],
  }));

  app.use(function detectAzureSSL(req, res, next) {
    if (!req.get('x-forwarded-proto') && req.get('x-arr-ssl')) {
      req.headers['x-forwarded-proto'] = 'https';
    }
    return next();
  });

  app.use(helmet());
  app.use(helmet.noCache());
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(xFrameOptions());
}

function setupOperationalRoutes(app) {
  app.use('/', require('./docs'));

  app.get('/health', (req, res) =>
    healthcheck()
      .then((result) => {
        if (!result.healthy) {
          res.status(500);
        }

        res.json(result);
      })
      .catch((err) => errors.validation(res, err.message)));
}

function setupStaticRoutes(app) {
  app.use(express.static('public', { maxAge: '1d' }));
}

function setupAuthMiddleware(app, log) {
  const authMiddleware = auth(app.locals.config.auth, log);
  if (authMiddleware) app.use(authMiddleware);
}

function setupRouters(app, log) {
  log.info('registering controllers...');

  let routes = flatten(requireAll({
    dirname:  __dirname + '/../api/controllers',
    recursive: true,
    resolve: (router) => () => router
  }));

  for (let uri in routes) {
    log.info(uri, routes[uri]);
    app.use(uri, routes[uri]());
  }
};

function setupErrorHandling(app) {
  app.use(function notFoundHandler(req, res) {
    errors.notFound(res, 'No handler exists for this url');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function errorHandler(err, req, res, next) {
    req.log.warn(err);
    errors.unexpected(res, err);
  });
}
