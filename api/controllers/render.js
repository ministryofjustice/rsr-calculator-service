const express = require('express');
const router = express.Router();

const registers = require('./register');
const errors = require('../../server/errors');

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
    return JSON.stringify(decodeURI(val)).replace(/undefined/gmi, '"N/A"').replace(/NaN/gmi, '"N/A"');
  } catch (ex) {
    console.error('Error while parsing value "' + val + '" for <' + key + '>');
  }
};

const getSortedOutputKeyList = (x) => {
  var keys = [];

  for (var k in x) {
    if (!~k.indexOf('_options')) {
      keys.push(k);
    }
  }

  keys.sort();

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
    filename: 'RSR_data_for_' + x.firstName + '_' + x.familyName + '.txt',
    body: oData.concat(
      getSortedOutputKeyList(x)
        .map((key) => {
          let val = x[key];
          let options = x[key + '_options'];

          if (val === undefined || val === 'undefined' || val === '' || val === null || val.toString() === 'NaN') {
            val = 'N/A';
          }

          if (val !== 'N/A') {
            if (options) {
              return (key === 'anyOtherOffence' ? 'anyOtherWeaponOffence' : key) + ': ' + options[parseInt(val)];
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
    .then(displayResult)
    .then(asDownloadableFile(res))
    .catch((err) => errors.validation(res, err.message));

router.post('/', render);

module.exports = router;
