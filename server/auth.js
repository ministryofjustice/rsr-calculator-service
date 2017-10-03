const basicAuth = require('basic-auth');

const unauthorized = (res) => {
  res.set('WWW-Authenticate', 'Basic realm=Password Required');
  res.status(401);
  res.json({
    error: 'authentication-required'
  });
};

const isAuthorised = (config, auth) =>
  (auth && auth.name === config.user && auth.pass === config.pass);

module.exports = (config, log) => {
  if (!config.user || !config.pass) {
    return null;
  }

  log.info({user: config.user}, 'Enabling basic auth');
  return function requireAuth(req, res, next) {
    if (!isAuthorised(config, basicAuth(req))) {
      return unauthorized(res);
    }
    return next();
  };
};
