const appVersion = 15;

const displayResult = (x) => {
	var oData = '******************************' + '\r\n';
	oData += 'RSR v' + appVersion + ' OFFICIAL' + '\r\n';
	oData += '******************************' + '\r\n';
	oData += '' + '\r\n';

	for (var key in x) {
		if (x[key] == undefined || x[key] == 'undefined' || x[key] == '' || x[key] == null || x[key] == NaN || x[key] == 'NaN') {
			x[key] = "N/A";
		}

		if (key.indexOf('options') == -1 ) {
			if (x[key + '_options'] != null) {
				if (key == 'anyOtherOffence') {
					oData += 'anyOtherWeaponOffence: ' + x[key + '_options'][parseInt(x[key])] + '\r\n';
				} else {
					oData += key + ': ' + x[key + '_options'][parseInt(x[key])] + '\r\n';
				}
			}

			else if (key == 'sex') {
				oData += key + ': ';
				oData += (parseInt(x[key]) == 0)? 'Male' : 'Female';
				oData += '\n';
			}

			else if (key == 'currentOffenceType') {
				oData += key + ': ' + x['offenceType_options'][parseInt(x[key])] + '\r\n';
			}

			else if (key == 'violentOffenceCategory') {
				oData += key + ': ' + x['violentOffenceCategory_options'][parseInt(x[key])] + '\r\n';
			}

			else {
				oData += key + ': ' + x[key] + '\r\n';
			}
		}
	}

	return oData.replace("undefined", "N/A").replace("NaN", "N/A");
}

module.exports = (req, res, next) =>
  (res.send(displayResult(req.param.id))) && next();
