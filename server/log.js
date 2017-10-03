const Logger = require('bunyan');

const config = require('./config');

// applicationinsights automatically collects bunyan logs
require('./azure-appinsights');

module.exports = new Logger({
  name: config.name,
  streams: [
    {
      stream: process.stdout,
      level: 'debug',
    }
  ]
});
