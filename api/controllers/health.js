const healthcheck = require('../health/healthcheck');

module.exports.health = (req, res, next) => {
  healthcheck()
    .then((result) => {
      if (!result.healthy) {
        res.status(500);
      }
      return res.json(result);
    })
    .catch(next);
};
