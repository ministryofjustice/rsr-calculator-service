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
  OGRS3: x.OGRS3,
  OGRS4s: x.OGRS4s,
  OGRS4v: x.OGRS4v,
  probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence,
  indecentImageProbability: x.indecentImageProbability,
  contactSexualProbability: x.contactSexualProbability,
  riskOfSeriousRecidivism: x.riskOfSeriousRecidivism,
  OGRS4sRiskBand: x.OGRS4sRiskBand,
  RSRPercentileRisk: x.RSRPercentileRisk,
  RSRRiskBand: x.RSRRiskBand,
  calculatorVersion: x.calculatorVersion,
});

const calculateRisk = (x) =>
  withValidResponse(RSRCalc.calculateRisk(withValidRequest(x)));

module.exports = (server) =>
  server.post({
    url: '/calculate',

    swagger: {
      summary: 'Calculate Risk of Serious Recidivism',
      docpath: 'calculate',
    },
  },
  (req, res) => res.send(calculateRisk(req.body))
);
