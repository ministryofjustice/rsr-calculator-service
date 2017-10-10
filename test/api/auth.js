const _ = require('lodash');
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('API Key authentication', () => {
  const auth = {
    keys: [ '2be60db6-68ad-4b57-aa99-457e6bbdf6c8' ],
    host: 'successful.example.com',
  };
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

  it('should block access with invalid auth', () =>
    request(server)
      .get('/whatever')
      .set('X-API-KEY', '871772e9-5fb3-4219-a852-3e0930288b6e')
      .expect(401)
  );

  it('should allow access with auth', () =>
    request(server)
      .get('/whatever')
      .set('X-API-KEY', '2be60db6-68ad-4b57-aa99-457e6bbdf6c8')
      .expect(404)
  );

  it('should block access without auth from blocked domain', () =>
    request(server)
      .get('/whatever')
      .set('Host', 'blocked.example.com')
      .expect(401)
  );

  it('should allow access with auth from blocked domain', () =>
    request(server)
      .get('/whatever')
      .set('Host', 'blocked.example.com')
      .set('X-API-KEY', '2be60db6-68ad-4b57-aa99-457e6bbdf6c8')
      .expect(404)
  );

  it('should allow access from allowed origin', () =>
    request(server)
      .get('/whatever')
      .set('Host', 'successful.example.com')
      .expect(404)
  );

  it('should allow /health access even without auth', () =>
    request(server)
      .get('/health')
      .expect(200)
  );

  it('should allow /rsr access even without auth', () =>
    request(server)
      .get('/rsr/index.html')
      .expect(200)
  );

  it('should allow / access even without auth', () =>
    request(server)
      .get('/')
      .expect(200)
  );
});
