const offenceTypeRegister = {
	"Absconding/ bail": 0,
	"Acquisitive violence": 1,
	"Burglary (domestic)": 2,
	"Burglary (other)": 3,
	"Criminal damage": 4,
	"Drink driving": 5,
	"Drug import/ export/ production": 6,
	"Drug possession/ supply": 7,
	"Drunkenness": 8,
	"Fraud, forgery &amp; misrepresentation": 9,
	"Handling stolen goods": 10,
	"Motoring (not drink driving)": 11,
	"Other offence": 12,
	"Public order, harassment": 13,
	"Sexual (against children)": 14,
	"Sexual (not against children)": 15,
	"Theft (not vehicle-related)": 16,
	"Vehicle-related theft": 17,
	"Violence against the person": 18,
	"Welfare fraud": 19
};

module.exports = (req, res, next) =>
  (res.send(offenceTypeRegister)) && next();
