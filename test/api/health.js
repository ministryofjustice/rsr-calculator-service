const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('api /health', () => {
  let server;
  before((done) => {
    app(config, log, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  describe('GET /health', () => {
    it('should return a 200 response with some content', () => {
      return request(server)
        .get('/health')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          res.body.should.have.property('healthy', true);
          res.body.should.have.property('checks');
          res.body.checks.should.have.property('calculatorVersion');
        });
    });
  });
});
