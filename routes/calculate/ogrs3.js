const RSRCalc = require('rsr-calculator');

const log = (x) => {
  console.log('>>>>>>>');
  console.log(x);
  return x;
};

const withValidRequest = (x) => {
  x.allSanctions = parseInt(x.allSanctions || 0, 10);

  return x;
};

const withValidResponse = (x) => ({
  calculatorVersion: x.calculatorVersion,
  OGRS3: x.OGRS3,
});

const calculateScore = (x) =>
  log(RSRCalc.calculateOGRS3(log(withValidRequest(x))));

const config = {
  url: '/calculate/ogrs3',

  swagger: {
    nickname: 'calculateOGRS3',
    summary: 'Calculate OGRS3',
    docpath: 'calculate/ogrs3',

    schemes: [ 'https' ],

    responseClass: 'OGRS3Result',

    responseMessages: [
      {
        code: 200,
        message: 'OK',
        responseModel: 'OGRS3Result',
      },
      {
        code: 500,
        message: 'Internal Server Error',
      },
    ],
  },

  validation: {
    allSanctions: { type: 'number', scope: 'body', swaggerType: 'number', default: '3' },
	},

  models: {
    OGRS3Result: {
			id: 'OGRS3Result',
			properties: {
        calculatorVersion: { type: 'string', default: '1.2.3' },
        OGRS3: { type: 'number', default: '0.65' },
			}
		}
  },
};

module.exports = (server) =>
  server.post(config, (req, res, next) => {
    res.send(log(withValidResponse(log(calculateScore(log(req.body))))));
    return next();
});
