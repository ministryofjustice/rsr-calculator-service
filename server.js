const config = require('./server/config');
const log = require('./server/log');

const makeDB = require('./server/db');
const makeApp = require('./server/app');

const db = makeDB(config.db, log);

makeApp(config, log, db, (err, server) => {
  if (err) throw err;

  server.on('listening', () => {
    log.info({addr: server.address()}, 'Server listening');
  });

  server.listen(config.port);
});
