
module.exports = (req, res, next) =>
  (res.send({ message: 'I feel good!' })) && next();
