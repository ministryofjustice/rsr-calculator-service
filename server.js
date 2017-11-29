// Do appinsights first as it does some magic instrumentation work
require('./server/azure-appinsights');

const http = require('http');

const config = require('./server/config');
const log = require('./server/log');

const makeApp = require('./server/app');

makeApp(config, log, (err, app) => {
  if (err) throw err;

  const server = http.createServer(app);

  server.listen(config.port, () => {
    log.info({ addr: server.address() }, 'Server listening' );
  });
});
