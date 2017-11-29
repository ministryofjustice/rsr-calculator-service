const express = require('express');
const router = express.Router();

const drug = [
	{ id: 0, label: 'Drugs never misused' },
	{ id: 1, label: 'Heroin' },
	{ id: 2, label: 'Methadone (not prescribed)' },
	{ id: 3, label: 'Other opiates' },
	{ id: 4, label: 'Crack/ Cocaine' },
	{ id: 5, label: 'Cocaine Hydrochloride' },
	{ id: 6, label: 'Misuse prescribed drugs' },
	{ id: 7, label: 'Benzodiazepines' },
	{ id: 8, label: 'Amphetamines' },
	{ id: 9, label: 'Hallucinogens' },
	{ id: 10, label: 'Ecstasy' },
	{ id: 11, label: 'Cannabis' },
	{ id: 12, label: 'Solvents (inc. gases and glues)' },
	{ id: 13, label: 'Steroids' },
	{ id: 14, label: 'Other' },
];

const offenceType = [
	{ id: 0, label: 'Absconding/ bail' },
	{ id: 1, label: 'Acquisitive violence' },
	{ id: 2, label: 'Burglary (domestic)' },
	{ id: 3, label: 'Burglary (other)' },
	{ id: 4, label: 'Criminal damage' },
	{ id: 5, label: 'Drink driving' },
	{ id: 6, label: 'Drug import/ export/ production' },
	{ id: 7, label: 'Drug possession/ supply' },
	{ id: 8, label: 'Drunkenness' },
	{ id: 9, label: 'Fraud, forgery &amp; misrepresentation' },
	{ id: 10, label: 'Handling stolen goods' },
	{ id: 11, label: 'Motoring (not drink driving)' },
	{ id: 12, label: 'Other offence' },
	{ id: 13, label: 'Public order, harassment' },
	{ id: 14, label: 'Sexual (against children)' },
	{ id: 15, label: 'Sexual (not against children)' },
	{ id: 16, label: 'Theft (not vehicle-related)' },
	{ id: 17, label: 'Vehicle-related theft' },
	{ id: 18, label: 'Violence against the person' },
	{ id: 19, label: 'Welfare fraud' },
];

const violentOffenceCategory = [
	{ id: 0, label: 'Summary violence' },
	{ id: 1, label: 'Actual/ threatened use of firearms' },
	{ id: 2, label: 'Possession/ supply of firearms' },
	{ id: 3, label: 'Other statutory weapon offences' },
	{ id: 4, label: 'Other indictable violence' },
];

const getDrugRegister = (req, res) =>
	res.json(drug);

const getOffenceTypeRegister = (req, res) =>
	res.json(offenceType);

const getViolentOffenceCategoryRegister = (req, res) =>
	res.json(violentOffenceCategory);

router.get('/drug', getDrugRegister);
router.get('/offenceType', getOffenceTypeRegister);
router.get('/violentOffenceCategory', getViolentOffenceCategoryRegister);

module.exports = router;

module.exports.violentOffenceCategoryRegister = violentOffenceCategory;
module.exports.offenceTypeRegister = offenceType;
module.exports.drugRegister = drug;
