const apiDocs = require('../swagger/docs');

module.exports.apiDocs = (req, res) => {
  return res.json(apiDocs);
};
