const RSRCalc = require('rsr-calculator');

const withValidRequest = (x) => {
  // fix dates
  x.assessmentDate = new Date(x.assessmentDate);
  x.firstSanctionDate = new Date(x.firstSanctionDate);
  x.sentenceDate = new Date(x.sentenceDate);
  x.convictionDate = new Date(x.convictionDate);
  x.birthDate = new Date(x.birthDate);

  return x;
};

const calculateRisk = (x) =>
  RSRCalc.calculateRisk(withValidRequest(x));

module.exports = (req, res, next) =>
  (res.send(201, calculateRisk(req.body))) && next();
