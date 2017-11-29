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
  return val ? 0 : 1;
};

const pickNumber = (req, key) => {
  let val = pick(req, key);
  let num = parseInt(val, 10);
  return isNaN(num) ? val || undefined : num ;
};

const getRequestParams = (x) => ({
  sex: pickNumber(x, 'sex'),
  gender: pickNumber(x, 'sex') === 0 ? 'M' : 'F', // derived from sex for OGRS3
  allSanctions: pickNumber(x, 'allSanctions'),
  currentOffenceType: pickNumber(x, 'currentOffenceType'),

  age: pick(x, 'age'),                             // derived from birthDate?
  pncId: pick(x, 'pncId'),                         // not part of calculation?
  deliusId: pick(x, 'deliusId'),                   // not part of calculation?

  birthDate: pickDate(x, 'birthDate'),
  assessmentDate: pickDate(x, 'assessmentDate'),
  convictionDate: pickDate(x, 'convictionDate'),
  sentenceDate: pickDate(x, 'sentenceDate'),
  firstSanctionDate: pickDate(x, pick(x, 'firstSanctionDate') ? 'firstSanctionDate' : 'convictionDate'),
  mostRecentSexualOffence: pickDate(x, 'mostRecentSexualOffence'),

  violentOffenceCategory: pickNumber(x, 'violentOffenceCategory'),
  sexualElement: pickBoolean(x, 'sexualElement'),
  strangerVictim: pickNumber(x, 'strangerVictim'),
  violentSanctions: pickNumber(x, 'violentSanctions'),
  sexualOffenceHistory: pickNumber(x, 'sexualOffenceHistory'),
  contactAdult: pickNumber(x, 'contactAdult'),
  contactChild: pickNumber(x, 'contactChild'),
  indecentImage: pickNumber(x, 'indecentImage'),
  paraphilia: pickNumber(x, 'paraphilia'),
  oasysInterview: pickBoolean(x, 'oasysInterview'),
  useWeapon: pickNumber(x, 'useWeapon'),
  accommodation: pickNumber(x, 'accommodation'),
  employment: pickNumber(x, 'employment'),
  currentUseOfAlcohol: pickNumber(x, 'currentUseOfAlcohol'),
  bingeDrinking: pickNumber(x, 'bingeDrinking'),
  impulsivity: pickNumber(x, 'impulsivity'),
  temper: pickNumber(x, 'temper'),
  temproCriminalper: pickNumber(x, 'proCriminal'),
  domesticViolence: pickNumber(x, 'domesticViolence'),
  murder: pickNumber(x, 'murder'),
  wounding: pickNumber(x, 'wounding'),
  kidnapping: pickNumber(x, 'kidnapping'),
  firearmPossession: pickNumber(x, 'firearmPossession'),
  robbery: pickNumber(x, 'robbery'),
  burglary: pickNumber(x, 'burglary'),
  anyOtherOffence: pickNumber(x, 'anyOtherOffence'),
  endangerLife: pickNumber(x, 'endagerLife'),
  arson: pickNumber(x, 'arson'),
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
  ].filter((k) => !x.hasOwnProperty(k) || x[k].toString() === 'null' || x[k].toString() === 'undefined' || x[k] === '');

const withFormattedResponse = (x) => ({
  calculatorVersion: x.calculatorVersion,
  OGRS3: x.OGRS3.result[0],
  OGRS4s: x.OGRS4s,
  OGRS4v: x.OGRS4v,
  OGRS4sRiskBand: x.OGRS4sRiskBand,
  probabilityOfNonSexualViolence: x.probabilityOfNonSexualViolence, //osp
  indecentImageProbability: x.indecentImageProbability, //
  contactSexualProbability: x.contactSexualProbability, //
  riskOfSeriousRecidivism: x.riskOfSeriousRecidivism,
  RSRPercentileRisk: x.RSRPercentileRisk,
  RSRRiskBand: x.RSRRiskBand,
  //explain: x.explain,
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
