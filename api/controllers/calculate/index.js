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

const logRequestRespone = (req, label, data) => {
  let anonData = Object.assign({}, data, {
    offenderTitle: undefined,
    firstName: undefined,
    familyName: undefined,
    pncId: undefined,
    deliusId: undefined,
  });

  req.log.debug({ [label]: anonData }, label);
  return data;
};

const pick = (x, key) =>
  (x && x[key]);

const pickDate = (x, key) => {
  let val = pick(x, key);
  return val ? new Date(val) : undefined;
};

const pickBoolean = (req, key) => {
  let val = pick(req, key);
  return parseInt(val, 10) === 1 ? 1 : 0;
};

const pickNumber = (req, key) => {
  let val = pick(req, key);
  let num = parseInt(val, 10);
  return isNaN(num) ? val || undefined : Math.max(num, 0);
};

const getRequestParams = (x) => ({
  sex: pickNumber(x, 'sex'),
  gender: pickNumber(x, 'sex') === 0 ? 'M' : 'F', // derived from sex for OGRS3
  previousSanctions: pickNumber(x, 'previousSanctions') || 0,
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
  endangerLife: pickBoolean(x, 'endangerLife'),
  arson: pickBoolean(x, 'arson'),
});

const getMissingRequiredFields = (x) =>
  [
    'sex',
    'gender',
    'previousSanctions',
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
  riskOfSeriousRecidivismNodeJS: x.riskOfSeriousRecidivismNodeJS,
  riskOfSeriousRecidivism: x.riskOfSeriousRecidivism,
  RSRPercentileRiskBeta18: x.RSRPercentileRiskBeta18,
  RSRPercentileRiskNodeJS: x.RSRPercentileRiskNodeJS,
  RSRPercentileRisk: x.RSRPercentileRisk,
  RSRRiskBandBeta18: x.RSRRiskBandBeta18,
  RSRRiskBandNodeJS: x.RSRRiskBandNodeJS,
  RSRRiskBand: x.RSRRiskBand,
  explain: x.explain,
});

const calculateRiskOfSeriousRecidivism = (req, res) => {
  let params = getRequestParams(req.body);

  logRequestRespone(req, 'request', params);

  let missing = getMissingRequiredFields(params);
  if (missing.length > 0) {
    return errors.validation(res, 'Required fields missing from request: ' + missing.join(', '));
  }

  return asJson(res, withFormattedResponse(logRequestRespone(req, 'response', RSRCalc.calculateRisk(params))));
};

router.post('/', calculateRiskOfSeriousRecidivism);

const getOSPRequestParams = (x) => ({
  sex: pick(x, 'sex'),
  hasSexualHistory: pick(x,'hasSexualHistory'),
  dateOfBirth: pickDate(x, 'dateOfBirth'),
  sentenceDate: pickDate(x, 'sentenceDate'),
  hasStrangerVictim: pick(x, 'hasStrangerVictim'),
  numberOfPreviousSanctions: pickNumber(x, 'numberOfPreviousSanctions'),
  numberOfSanctionsChildContact: pickNumber(x, 'numberOfSanctionsChildContact'),
  numberOfSanctionsAdultContact: pickNumber(x, 'numberOfSanctionsAdultContact'),
  numberOfSanctionsParaphilia: pickNumber(x, 'numberOfSanctionsParaphilia'),
  numberOfSanctionsIndecentImages: pickNumber(x, 'numberOfSanctionsIndecentImages'),
  mostRecentSexualOffenceDate: pickDate(x, 'mostRecentSexualOffenceDate')
});

const getOSPMissingRequiredFields = (x) =>
[
  'sex',
  'hasSexualHistory',
  'dateOfBirth',
  'sentenceDate',
  'hasStrangerVictim',
  'numberOfPreviousSanctions',
  'numberOfSanctionsChildContact',
  'numberOfSanctionsAdultContact',
  'numberOfSanctionsParaphilia',
  'numberOfSanctionsIndecentImages',
  'mostRecentSexualOffenceDate'
].filter((k) => {
  return !x.hasOwnProperty(k) || x[k] === 'null' || x[k] === 'undefined' || x[k] === '';
});

const withFormattedOSPResponse = (x) =>
  ({
  calculatorVersion: x.calculatorVersion,
  indecentImageProbability: {year1: x.indecentImageProbability[0], year2:  x.indecentImageProbability[1]},
  sexualContactProbability: {year1: x.sexualContactProbability[0], year2:  x.sexualContactProbability[1]},
});

const calculateOSP = (req, res) => {
  let params = getOSPRequestParams(req.body);

  logRequestRespone(req, 'request', params);
  let missing = getOSPMissingRequiredFields(params);
  if (missing.length > 0) {
    return errors.validation(res, 'Required fields missing from request: ' + missing.join(', '));
  }

  var calculateOSP1 = RSRCalc.calculateOSP(params)

  return asJson(res, withFormattedOSPResponse(logRequestRespone(req, 'response', calculateOSP1)));
};

router.post('/osp', calculateOSP);

module.exports = router;
