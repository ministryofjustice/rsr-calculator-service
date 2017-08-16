const RSRCalc = require('rsr-calculator');

const asJson = (res, x) =>
  res.json(x);

const withParam = (req, key) =>
  (req.swagger.params.body && req.swagger.params.body.value && req.swagger.params.body.value[key]);

const withValidRequest = (x) => {
  x.gender = x.gender || 'M';
  x.previousSanctions = parseInt(x.previousSanctions || 0, 10);
  x.currentOffenceType = parseInt(x.currentOffenceType || 0, 10);
  x.currentOffenceFactor = x.currentOffenceFactor && parseInt(x.currentOffenceFactor, 10);

  x.assessmentDate = new Date(x.assessmentDate);
  x.firstSanctionDate = new Date(x.firstSanctionDate);
  x.convictionDate = new Date(x.convictionDate);
  x.birthDate = new Date(x.birthDate);

  return x;
};

const withValidResponse = (x) => ({
  calculatorVersion: x.calculatorVersion,
  OGRS3: x.OGRS3 || [ 0, 0 ],
  OGRS3PercentileRisk: x.OGRS3PercentileRisk || [ 0, 0 ],
});

const calculateOGRS3 = (x) =>
  RSRCalc.calculateOGRS3(withValidRequest(x));

module.exports.calculate = (req, res, next) => {
  var x = {
    gender: withParam(req, 'gender'),
    birthDate: withParam(req, 'birthDate'),
    convictionDate: withParam(req, 'convictionDate'),
    firstSanctionDate: withParam(req, 'firstSanctionDate'),
    previousSanctions: withParam(req, 'previousSanctions'),
    assessmentDate: withParam(req, 'assessmentDate'),
    currentOffenceType: withParam(req, 'currentOffenceType'),
    currentOffenceFactor: withParam(req, 'currentOffenceFactor'),
  };

  asJson(res, withValidResponse(calculateOGRS3(x)));

  next();
};
