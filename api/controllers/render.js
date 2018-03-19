const express = require('express');
const router = express.Router();

const registers = require('./register');
const errors = require('../../server/errors');

const fieldList = {
  offenderTitle: String,
  firstName: String,
  familyName: String,
  sex: Number,
  birthDate: Date,
  age: Number,
  pncId: String,
  deliusId: String,
  assessmentDate: Date,
  currentOffenceType: Number,
  convictionDate: Date,
  sentenceDate: Date,
  sexualElement: Boolean,
  violentOffenceCategory: Number,
  strangerVictim: Boolean,
  firstSanctionDate: Date,
  previousSanctions: Number,
  violentSanctions: Number,
  sexualOffenceHistory: Boolean,
  mostRecentSexualOffence: Date,
  contactAdult: Number,
  contactChild: Number,
  indecentImage: Number,
  paraphilia: Number,
  oasysInterview: Boolean,
  useWeapon: Boolean,
  partner: Number,
  accommodation: Number,
  employment: Boolean,
  relationship: Number,
  currentUseOfAlcohol: Number,
  bingeDrinking: Number,
  impulsivity: Number,
  temper: Number,
  proCriminal: Number,
  domesticViolence: Boolean,
  murder: Boolean,
  wounding: Boolean,
  kidnapping: Boolean,
  firearmPossession: Boolean,
  robbery: Boolean,
  burglary: Boolean,
  anyOtherOffence: Boolean,
  endangerLife: Boolean,
  arson: Boolean,
  totalRSR: Number,
  rsrType: String,
};

const log = (l, x) => {
  console.log(l, x);
  return x;
};

// helpers
const safely = (fn) => {
  try {
    return fn();
  } catch (ex) {
    // ignore failures
  }
};

const safeParse = (key, val) => {
  try {
    return JSON.stringify(decodeURI(val)).replace(/"/gmi, '').replace(/undefined/gmi, 'N/A').replace(/NaN/gmi, 'N/A');
  } catch (ex) {
    console.error('Error while parsing value "' + val + '" for <' + key + '>');
  }
};

const getOutputKeyList = (x) => {
  var keys = [];

  for (var k in x) {
    if (!~k.indexOf('_options')) {
      keys.push(k);
    }
  }

  return keys;
};


// public

const displayResult = (x) => {
  let appVersion = safely(() => require('../../package.json').version);

  let oData = [
		'******************************',
		'RSR v' + appVersion + ' OFFICIAL',
		'******************************',
		'',
	];

  return {
    filename: `RSR_data_for_${(x.firstName||'').replace(/\s/gmi, '_')}_${(x.familyName||'').replace(/\s/gmi, '_')}.txt`,
    body: oData.concat(
      getOutputKeyList(fieldList)
        .map((key) => {
          let val = x[key];

          if (val === undefined || val === 'undefined' || val === '' || val === null || val.toString() === 'NaN') {
            val = 'N/A';
          }

          if (val !== 'N/A') {
            if (fieldList[key] === Boolean) {
              if (key === 'anyOtherOffence') {
                key = 'anyOtherWeaponOffence';
              }

              return key + ': ' + (parseInt(val, 10) === 0 ? 'Yes' : 'No');
            }

            switch (key) {
              case 'sex':
                val = parseInt(val, 10) === 0 ? 'Male' : 'Female';
              break;

              case 'currentOffenceType':
                val = registers.offenceTypeRegister[parseInt(val, 10)].label;
              break;

              case 'violentOffenceCategory':
                val = registers.violentOffenceCategoryRegister[parseInt(val, 10)].label;
              break;
            }
          }

          return key + ': ' + safeParse(key, val);
        })
    ).join('\r\n'),
  };
};

const logResults = (req) => (data) => {
  let anonData = Object.assign({}, data, {
    offenderTitle: undefined,
    firstName: undefined,
    familyName: undefined,
    pncId: undefined,
    deliusId: undefined,
  });

  req.log.debug({ anonData }, 'submission');
  return data;
};

const asDownloadableFile = (res) => (x) => {
  res.attachment(x.filename);
  res.set('content-type', 'application/octet-stream');

  res.send(x.body);
};

const validateRequest = (data) =>
  new Promise((res, rej) => {
    for (var p in data) {
      if (/<.*?>/gm.test(decodeURI(data[p]))) {
        return rej(new Error('Data contained illegal characters'));
      }
    }

    res(data);
  });

const render = (req, res) =>
  validateRequest(req.body)
    .then(logResults(req))
    .then(displayResult)
    .then(asDownloadableFile(res))
    .catch((err) => errors.validation(res, err.message));

router.post('/', render);

module.exports = router;
