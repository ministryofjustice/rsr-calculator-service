const _ = require('lodash');
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('basic authentication', () => {
  const auth = {user: 'basic-username', pass: 'basic-password'};
  let server;
  before((done) => {
    const configWithAuth = _.defaults({auth}, config);
    app(configWithAuth, log, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  it('should block access without auth', () =>
    request(server)
      .get('/whatever')
      .expect(401)
  );

  it('should allow access with auth', () =>
    request(server)
      .get('/whatever')
      .auth(auth.user, auth.pass)
      .expect(404)
  );

  it('should allow /health access even without auth', () =>
    request(server)
      .get('/health')
      .expect(200)
  );
});
