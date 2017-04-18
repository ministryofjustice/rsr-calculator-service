const drugRegister = {
	'Drugs never misused': 0,
	'Heroin': 1,
	'Methadone (not prescribed)': 2,
	'Other opiates': 3,
	'Crack/ Cocaine': 4,
	'Cocaine Hydrochloride': 5,
	'Misuse prescribed drugs': 6,
	'Benzodiazepines': 7,
	'Amphetamines': 8,
	'Hallucinogens': 9,
	'Ecstasy': 10,
	'Cannabis': 11,
	'Solvents (inc. gases and glues)': 12,
	'Steroids': 13,
	'Other': 14,
};

const config = {
  url: '/drug',
};

module.exports = (server) =>
  server.get(config, (req, res, next) => {
		res.send(drugRegister);
		return next();
	});
