const restify = require('restify');

const unauthorized = (res) => {
  res.set('WWW-Authenticate', 'Basic realm=Password Required');
  res.send(new restify.UnauthorizedError('Password Required'));
};

const getAuthDetails = (req) => {
  return (req.authorization && req.authorization.basic);
};

const isAuthorised = (config, auth) =>
  (auth && auth.username === config.user && auth.password === config.pass);

module.exports = (server, config, log) => {
  if (config.user && config.pass) {
    log.info({user: config.user}, 'Enabling basic auth');

    server.use((req, res, next) => {
      if (!isAuthorised(config, getAuthDetails(req))) {
        return unauthorized(res);
      }
      return next();
  });
  }

  return server;
};
