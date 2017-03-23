const violentOffenceCategoryRegister = {
	"Summary violence": 0,
	"Actual/ threatened use of firearms": 1,
	"Possession/ supply of firearms": 2,
	"Other statutory weapon offences": 3,
	"Other indictable violence": 4,
};

module.exports = (req, res, next) =>
  (res.send(violentOffenceCategoryRegister)) && next();
