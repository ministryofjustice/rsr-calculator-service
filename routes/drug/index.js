const drugRegister = {
	"Drugs bever misused": 0,
	"Heroin": 1,
	"Methadone (not prescribed)": 2,
	"Other opiates": 3,
	"Crack/ Cocaine": 4,
	"Cocaine Hydrochloride": 5,
	"Misuse perscribed drugs": 6,
	"Benzodiazepines": 7,
	"Amphetamines": 8,
	"Hallucinogens": 9,
	"Ecstasy": 10,
	"Cannabis": 11,
	"Solvents (inc. gases and glues)": 12,
	"Steroids": 13,
	"Other": 14,
};

module.exports = (req, res, next) =>
  (res.send(drugRegister)) && next();
