const express = require('express');
const router = express.Router();

const RSRCalc = require('rsr-calculator');
const errors = require('../../../server/errors');

const asJson = (res, x) =>
  res.json(x);

const log = (x) => {
  console.log(x);
  return x;
};

const pick = (x, key) =>
  (x && x[key]);

const pickDate = (x, key) => {
  let val = pick(x, key);
  return val ? new Date(val) : undefined;
};

const pickBoolean = (req, key) => {
  let val = pick(req, key);
  return val ? 1 : 0;
};

const pickNumber = (req, key) => {
  let val = pick(req, key);
  let num = parseInt(val, 10);
  return isNaN(num) ? val || undefined : num ;
};

const getRequestParams = (x) => ({
  sex: pickNumber(x, 'sex'),
  gender: pickNumber(x, 'sex') === 0 ? 'M' : 'F', // derived from sex for OGRS3
  allSanctions: pickNumber(x, 'allSanctions') || 0,
  currentOffenceType: pickNumber(x, 'currentOffenceType'),

/* // note required
  age: pick(x, 'age'),                             // derived from birthDate?
  pncId: pick(x, 'pncId'),                         // not part of calculation?
  deliusId: pick(x, 'deliusId'),                   // not part of calculation?
*/

  birthDate: pickDate(x, 'birthDate'),
  assessmentDate: pickDate(x, 'assessmentDate'),
  convictionDate: pickDate(x, 'convictionDate'),
  sentenceDate: pickDate(x, 'sentenceDate'),
  firstSanctionDate: pickDate(x, pick(x, 'firstSanctionDate') ? 'firstSanctionDate' : 'convictionDate'),
  mostRecentSexualOffence: pickDate(x, 'mostRecentSexualOffence'),

  violentOffenceCategory: pickNumber(x, 'violentOffenceCategory'),
  sexualElement: pickBoolean(x, 'sexualElement'),
  strangerVictim: pickBoolean(x, 'strangerVictim'),
  violentSanctions: pickNumber(x, 'violentSanctions'),

  sexualOffenceHistory: pickBoolean(x, 'sexualOffenceHistory'),
  contactAdult: pickNumber(x, 'contactAdult'),
  contactChild: pickNumber(x, 'contactChild'),
  indecentImage: pickNumber(x, 'indecentImage'),
  paraphilia: pickNumber(x, 'paraphilia'),

  oasysInterview: pickBoolean(x, 'oasysInterview'),
  useWeapon: pickBoolean(x, 'useWeapon'),
  accommodation: pickNumber(x, 'accommodation'),
  employment: pickBoolean(x, 'employment'),
  currentUseOfAlcohol: pickNumber(x, 'currentUseOfAlcohol'),
  bingeDrinking: pickNumber(x, 'bingeDrinking'),
  impulsivity: pickNumber(x, 'impulsivity'),
  temper: pickNumber(x, 'temper'),
  proCriminal: pickNumber(x, 'proCriminal'),
  domesticViolence: pickBoolean(x, 'domesticViolence'),
  murder: pickBoolean(x, 'murder'),
  wounding: pickBoolean(x, 'wounding'),
  kidnapping: pickBoolean(x, 'kidnapping'),
  firearmPossession: pickBoolean(x, 'firearmPossession'),
  robbery: pickBoolean(x, 'robbery'),
  burglary: pickBoolean(x, 'burglary'),
  anyOtherOffence: pickBoolean(x, 'anyOtherOffence'),
  endangerLife: pickBoolean(x, 'endagerLife'),
  arson: pickBoolean(x, 'arson'),
});

const getMissingRequiredFields = (x) =>
  [
    'sex',
    'gender',
    'allSanctions',
    'currentOffenceType',

    'birthDate',
    'assessmentDate',
    'convictionDate',
    'sentenceDate',
    'firstSanctionDate',
    'mostRecentSexualOffence'
  ].filter((k) => {
    return !x.hasOwnProperty(k) || x[k] === 'null' || x[k] === 'undefined' || x[k] === '';
  });

const withFormattedResponse = (x) => ({
  calculatorVersion: x.calculatorVersion,
  OGRS3: x.OGRS3.result[0],
  OGRS4s: x.OGRS4s,
  OGRS4v: x.OGRS4v,
  OGRS4sRiskBand: x.OGRS4sRiskBand,
  probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence, //osp
  indecentImageProbability: x.indecentImageProbability, //
  contactSexualProbability: x.contactSexualProbability, //
  riskOfSeriousRecidivismBeta18: x.riskOfSeriousRecidivismBeta18,
  riskOfSeriousRecidivism: x.riskOfSeriousRecidivism,
  RSRPercentileRiskBeta18: x.RSRPercentileRiskBeta18,
  RSRPercentileRisk: x.RSRPercentileRisk,
  RSRRiskBandBeta18: x.RSRRiskBandBeta18,
  RSRRiskBand: x.RSRRiskBand,
  explain: x.explain,
});

const calculateRiskOfSeriousRecidivism = (req, res) => {
  let params = getRequestParams(req.body);

  let missing = getMissingRequiredFields(params);
  if (missing.length > 0) {
    return errors.validation(res, 'Required fields missing from request: ' + missing.join(', '));
  }

  return asJson(res, withFormattedResponse(RSRCalc.calculateRisk(params)));
};

router.post('/', calculateRiskOfSeriousRecidivism);

module.exports = router;
