const parse = (string) => {
  if (!string || typeof string !== 'string' || string.length === 0) {
    return undefined;
  }

  // return API Key
  return string;
};

const getAPIKey = (req) => {
  if (!req.headers || typeof req.headers !== 'object') {
    throw new TypeError('argument req is required to have headers property');
  }

  return req.header('X-API-KEY');
};

const getHostname = (req) => {
  if (!req.headers || typeof req.headers !== 'object') {
    throw new TypeError('argument req is required to have headers property');
  }

  return req.hostname;
};

const validateAuth = (req) => {
  if (!req) {
    throw new TypeError('argument req is required');
  }

  if (typeof req !== 'object') {
    throw new TypeError('argument req is required to be an object');
  }

  // get header
  var hostname = getHostname(req.req || req);
  var apiKey = getAPIKey(req.req || req);

  // parse header
  return {
    hostname: hostname,
    apiKey: parse(apiKey)
  };
};

const unauthorized = (res) => {
  res.set('WWW-Authenticate', 'Basic realm=API Key required');
  res.status(401);
  return res.json({
    error: 'authentication-required',
  });
};

const isAuthorised = (config, auth) =>
  (auth.hostname === config.host || (config.keys && ~config.keys.indexOf(auth.apiKey)));

module.exports = (config, log) => {
  if (!config.keys && !config.host) {
    return null;
  }

  log.info('Enabling API Key auth');
  return function apiKeyAuth(req, res, next) {
    if (!isAuthorised(config, validateAuth(req))) {
      return unauthorized(res);
    }
    return next();
  };
};
