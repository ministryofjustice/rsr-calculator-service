const config = require('./server/config');
const log = require('./server/log');

const makeApp = require('./server/app');

makeApp(config, log, (err, server) => {
  if (err) throw err;

  server.on('listening', () => {
    log.info({addr: server.address()}, 'Server listening');
  });

  server.listen(config.port);
});
