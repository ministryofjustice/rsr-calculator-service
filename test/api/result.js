const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('api /render', () => {
  let server;
  before((done) => {
    app(config, log, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  it('should return a 200 response when a valid request is submitted', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({
        hello: 'world',
        lessThan: '<world',
        greaterThan: 'world>'
      })
      .expect('Content-Type', /octet-stream/)
      .expect(200);
  });

  it('should return a 400 response when possible non plain text value detected', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({
        emptyTag: '<>',
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should return a 400 response when script injection detected', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({
        hello: '<script>alert("world");</script>',
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
