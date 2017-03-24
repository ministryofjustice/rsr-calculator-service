const RSRCalc = require('rsr-calculator');

const withValidRequest = (x) => {
  // fix dates
  x.assessmentDate = new Date(x.assessmentDate);
  x.firstSanctionDate = new Date(x.firstSanctionDate);
  x.sentenceDate = new Date(x.sentenceDate);
  x.convictionDate = new Date(x.convictionDate);
  x.birthDate = new Date(x.birthDate);

  return x;
};

const calculateRisk = (x) =>
  RSRCalc.calculateRisk(withValidRequest(x));

module.exports = (server) =>
  server.post({
    url: '/calculate',

    swagger: {
      summary: 'Calculate Risk of Serious Recidivism',
      docpath: 'calculate',
    },

    validation: {
      assessmentDate: { isRequired: true, scope: 'body' }
    },

    models: {
      assessmentDate: { type: 'date'},
    }
  },
  (req, res) => res.send(calculateRisk(req.body))
);
