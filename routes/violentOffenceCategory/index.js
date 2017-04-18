const violentOffenceCategoryRegister = [
	{ id: 0, label: 'Summary violence' },
	{ id: 1, label: 'Actual/ threatened use of firearms' },
	{ id: 2, label: 'Possession/ supply of firearms' },
	{ id: 3, label: 'Other statutory weapon offences' },
	{ id: 4, label: 'Other indictable violence' },
];

const config = {
	url: '/violentOffenceCategory',

  swagger: {
    nickname: 'listViolentOffenceCategories',
    summary: 'A list of Violence Offence Categories',
    docpath: 'violentOffenceCategory',

    schemes: [ 'https' ],

    responseClass: 'ViolentOffenceCategoryList',

    responseMessages: [
      {
        code: 200,
        message: 'OK',
        responseModel: 'ViolentOffenceCategoryList',
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
		ViolentOffenceCategoryList: {
			type: 'array',
			items: {
				type: 'ViolentOffenceCategory'
			},
		},
		ViolentOffenceCategory: {
			id: 'ViolentOffenceCategory',
			properties: {
				id: { type: 'Number' },
				label: { type: 'String' },
			}
		}
  },
};

module.exports = (server) =>
  server.get(config, (req, res, next) => {
		res.send(violentOffenceCategoryRegister);
		return next();
	});
