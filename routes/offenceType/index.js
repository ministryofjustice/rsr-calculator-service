const offenceTypeRegister = [
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

const config = {
	url: '/offenceType',

  swagger: {
    nickname: 'listOffenceTypes',
    summary: 'A list of Offence Types',
    docpath: 'offenceType',

    schemes: [ 'https' ],

    responseClass: 'OffenceTypeList',

    responseMessages: [
      {
        code: 200,
        message: 'OK',
        responseModel: 'OffenceTypeList',
      },
      {
        code: 500,
        message: 'Internal Server Error',
      },
    ],
  },

  validation: {
	},

  models: {
    OffenceTypeList: {
      id: 'OffenceTypeList',
			type: 'Array',
			items: { type: 'OffenceType' },
    },
		OffenceType: {
			id: 'OffenceType',
			properties: {
				id: { type: 'Number' },
				label: { type: 'String' },
			}
		}
  },
};

module.exports = (server) =>
  server.get(config, (req, res, next) => {
		res.send(offenceTypeRegister);
		return next();
	});
