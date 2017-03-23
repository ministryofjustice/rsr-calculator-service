
module.exports = (req, res, next) =>
  (res.send({ message: 'pong' })) && next();
