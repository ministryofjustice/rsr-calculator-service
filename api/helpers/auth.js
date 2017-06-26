const unauthorized = (res) => {
  res.set('WWW-Authenticate', 'Basic realm=Password Required');
  return new restify.UnauthorizedError('Password Required');
};

const getAuthDetails = (req) => {
  var basic = (req.authorization && req.authorization.basic);

  if (!basic) {
    return;
  }

  return {
    username: basic.username,
    password: basic.password,
  };
};

const isAuthorised = (config, auth) =>
  (!auth || auth.username !== config.authUser || auth.password !== config.authPass);

module.exports = (server) => {
  var config = server.config;

  if (config.authUser && config.authPass) {
    config.log.info({user: config.authUser}, 'Enabling basic auth');

    server.use((req, res, next) => {
      return next(isAuthorised(config, getAuthDetails(req)) ? undefined : unauthorized(res));
    });
  }

  return server;
};
