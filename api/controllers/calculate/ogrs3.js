const express = require('express');
const router = express.Router();

const RSRCalc = require('rsr-calculator');
const errors = require('../../../server/errors');

const asJson = (res, x) =>
  res.json(x);

const log = (l, x) => {
  console.log(l, x);
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

const pickFloat = (req, key) => {
  let val = pick(req, key);
  let num = parseFloat(val);
  return isNaN(num) ? val || undefined : num ;
};

const getRequestParams = (x) => ({
  sex: pickNumber(x, 'sex'),
  gender: pick(x,'gender') || (pickNumber(x, 'sex') === 0 ? 'M' : 'F') || 'M', // derived from sex for OGRS3
  previousSanctions: pickNumber(x, 'previousSanctions'),
  currentOffenceType: pickNumber(x, 'currentOffenceType'),
  currentOffenceFactor: pickFloat(x, 'currentOffenceFactor'),

  birthDate: pickDate(x, 'birthDate'),
  assessmentDate: pickDate(x, 'assessmentDate'),
  convictionDate: pickDate(x, 'convictionDate'),
  firstSanctionDate: pickDate(x, pick(x, 'firstSanctionDate') ? 'firstSanctionDate' : 'convictionDate'),
  mostRecentSexualOffence: pickDate(x, 'mostRecentSexualOffence'),
});

const getMissingRequiredFields = (x) =>
  [
    'gender',
    'previousSanctions',

    'birthDate',
    'assessmentDate',
    'convictionDate',
    'firstSanctionDate'
  ].filter((k) =>!x.hasOwnProperty(k) || x[k].toString() === 'null' || x[k].toString() === 'undefined' || x[k] === '');

const withFormattedResponse = (x) => ({
  calculatorVersion: x.calculatorVersion,
  OGRS3: x.OGRS3.result || [ 0, 0 ],
  OGRS3PercentileRisk: x.OGRS3PercentileRisk || [ 0, 0 ],
  //explain: x.OGRS3.explain,
});

const calculateOffenderGroupRiskScore = (req, res) => {
  let params = getRequestParams(req.body);

  let missing = getMissingRequiredFields(params);
  if (missing.length > 0) {
    return errors.validation(res, 'Required fields missing: ' + missing.join(', '));
  }

  if (!params.currentOffenceType && !params.currentOffenceFactor) {
    return errors.validation(res, 'Either currentOffenceType or currentOffenceFactor must be present');
  }

  if (params.currentOffenceType && isNaN(params.currentOffenceType)) {
    return errors.validation(res, 'currentOffenceType must be a valid number');
  }

  if (params.currentOffenceFactor && isNaN(params.currentOffenceFactor)) {
    return errors.validation(res, 'currentOffenceFactor must be a valid float');
  }

  if (params.gender !== 'M' && params.gender !== 'F') {
    return errors.validation(res, 'Gender must be either "M" or "F"');
  }

  return asJson(res, withFormattedResponse(RSRCalc.calculateOGRS3(params)));
};

router.post('/', calculateOffenderGroupRiskScore);
router.post('/customised', calculateOffenderGroupRiskScore);

module.exports = router;
