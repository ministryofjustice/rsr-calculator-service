const express = require('express');
const bunyanMiddleware = require('bunyan-middleware');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const xFrameOptions = require('x-frame-options');

const requireAuth = require('./auth');
const serveDocs = require('./docs');

const errors = require('./errors');

const registerController = require('../api/controllers/registers');
const resultController = require('../api/controllers/result');
const ogrs3Controller = require('../api/controllers/ogrs3');
const rsrController = require('../api/controllers/rsr');
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
  app.use(helmet.noCache());

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(xFrameOptions());
}

function setupAppRoutes(app, config, log) {
  app.get('/health', healthController.health);

  app.use(serveDocs());

  app.use(express.static('public', { maxAge: '1d' }));

  const authMiddleware = requireAuth(config.auth, log);
  if (authMiddleware) app.use(authMiddleware);

  app.get('/register/drug', registerController.drug);
  app.get('/register/offenceType', registerController.offenceType);
  app.get('/register/violentOffenceCategory', registerController.violentOffenceCategory);

  app.post('/calculate/ogrs3', ogrs3Controller.calculate);
  app.post('/calculate/ogrs3/customised', ogrs3Controller.calculate);

  app.post('/calculate', rsrController.calculate);

  app.post('/render', resultController.render);

  app.use(function notFoundHandler(req, res) {
    errors.notFound(res, 'No handler exists for this url');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function errorHandler(err, req, res, next) {
    req.log.warn(err);
    errors.unexpected(res, err);
  });
}
