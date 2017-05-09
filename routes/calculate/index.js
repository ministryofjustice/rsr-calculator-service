const RSRCalc = require('rsr-calculator');

const withValidRequest = (x) => {
  // fix dates
  x.assessmentDate = new Date(x.assessmentDate);
  x.firstSanctionDate = new Date(x.firstSanctionDate);
  x.sentenceDate = new Date(x.sentenceDate);
  x.convictionDate = new Date(x.convictionDate);
  x.birthDate = new Date(x.birthDate);

  // translate booleans
  x.oasysInterview = (x.oasysInterview ? 0 : 1);
  x.sexualElement = (x.sexualElement ? 0 : 1);

  return x;
};

const withValidResponse = (x) => ({
  calculatorVersion: x.calculatorVersion,
  OGRS3: x.OGRS3,
  OGRS4s: x.OGRS4s,
  OGRS4v: x.OGRS4v,
  OGRS4sRiskBand: x.OGRS4sRiskBand,
  probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence, //osp
  indecentImageProbability: x.indecentImageProbability, //
  contactSexualProbability: x.contactSexualProbability, //
  riskOfSeriousRecidivism: x.riskOfSeriousRecidivism,
  RSRPercentileRisk: x.RSRPercentileRisk,
  RSRRiskBand: x.RSRRiskBand,
});

const calculateRisk = (x) =>
  RSRCalc.calculateRisk(withValidRequest(x));

const config = {
  url: '/calculate',

  swagger: {
    summary: 'Calculate Risk of Serious Recidivism',
    docpath: 'calculate',
  },

  validation: {
	},
};

module.exports = (server) =>
  server.post(config, (req, res, next) => {
    res.send(withValidResponse(calculateRisk(req.body)));
    return next();
});
