const RSRCalc = require('rsr-calculator');

module.exports.health = (req, res, next) => {
  res.send({
    healthy: true,
    checks: {
      calculatorVersion: RSRCalc.calculatorVersion,
    },
    uptime: process.uptime(),
    build: safely(() => require('../../build-info.json')),
    version: safely(() => require('../../package.json').version),
  });
};

function safely(fn) {
  try {
    return fn();
  } catch (ex) {
    // ignore failures
  }
};
