const express = require('express');
const bunyanMiddleware = require('bunyan-middleware');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const requireAuth = require('./auth');
const serveDocs = require('./docs');

const errors = require('./errors');

const ogrs3Controller = require('../api/controllers/ogrs3');
const healthController = require('../api/controllers/health');

module.exports = (config, log, callback) => {
  const app = express();

  app.set('json spaces', 2);
  app.set('trust proxy', true);

  setupBaseMiddleware(app, log);

  setupAppRoutes(app, config, log);

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
  app.use(bodyParser.json());
}

function setupAppRoutes(app, config, log) {
  app.get('/health', healthController.health);

  const authMiddleware = requireAuth(config.auth, log);
  if (authMiddleware) app.use(authMiddleware);

  app.use(serveDocs());

  app.use(express.static('public'));

  app.post('/calculate/ogrs3', ogrs3Controller.calculate);
  app.post('/calculate/ogrs3/customised', ogrs3Controller.calculate);

  app.use(function notFoundHandler(req, res) {
    errors.notFound(res, 'No handler exists for this url');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function errorHandler(err, req, res, next) {
    req.log.warn(err);
    errors.unexpected(res, err);
  });
}
