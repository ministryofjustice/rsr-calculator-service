const restify = require('restify');
const Logger = require('bunyan');

const config = require('./config');

module.exports = new Logger({
  name: config.name + ':server',
  streams: [
    {
      stream: process.stdout,
      level: 'debug',
    }
  ],
  serializers: restify.bunyan.serializers,
});
