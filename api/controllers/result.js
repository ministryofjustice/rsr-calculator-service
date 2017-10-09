const registers = require('./registers');

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
    return JSON.stringify(val);
  } catch (ex) {
    console.error('Error while parsing value "' + val + '" for <' + key + '>');
  }
};

const getSortedOutputKeyList = (x) => {
  var keys = [];

  for (var k in x) {
    if (x.hasOwnProperty(k)) {
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

  return oData.concat(
    getSortedOutputKeyList(x)
      .map((key) => {
        let val = x[key];
        let options = x[key + '_options'];

        if (!val || val === 'undefined' || val === undefined || val === 'null' || val === '') {
          val = 'N/A';
        }

        if (options) {
          return (key === 'anyOtherOffence' ? 'anyOtherWeaponOffence' : key) + ': ' + options[parseInt(val)];
        }

        switch (key) {
          case 'sex':
            val = parseInt(val) === 0 ? 'Male' : 'Female';
          break;

          case 'currentOffenceType':
            val = registers.offenceTypeRegister[parseInt(val)].label;
          break;

          case 'violentOffenceCategory':
            val = registers.violentOffenceCategoryRegister[parseInt(val)].label;
          break;
        }

        return key + ': ' + safeParse(key, val);
      })
  ).join('\r\n');
};

module.exports.render = (req, res) =>
	res.send(displayResult(req.body));
