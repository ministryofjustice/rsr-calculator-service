const RSRCalc = require('rsr-calculator');

const validateRequest = (x) => {
  // fix dates
  x.assessmentDate = new Date(x.assessmentDate);
  x.firstSanctionDate = new Date(x.firstSanctionDate);
  x.sentenceDate = new Date(x.sentenceDate);
  x.convictionDate = new Date(x.convictionDate);
  x.birthDate = new Date(x.birthDate);

  return x;
}

module.exports = (req, res, next) => {

  var result = RSRCalc.calculateRisk(validateRequest(req.body));
  res.send(201, result);
  return next();
};
