const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('api /api-docs', () => {
  let server;
  before((done) => {
    app(config, log, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  describe('GET /api-docs', () => {
    it('should return a json response', () => {
      return request(server)
        .get('/api-docs')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('should return a valid swagger 2.0 document', () => {
      return request(server)
        .get('/api-docs')
        .set('Accept', 'application/json')
        .then((res) => {
          return new Promise((resolve, reject) => {
            require('swagger-tools').specs.v2_0.validate(res.body, (err, results) => {
              if (err) return reject(err);

              if (results && results.errors && results.errors.length > 0) {
                const error = results.errors
                  .map(({message, path}) => `${message} at ${path.join(".")}`)
                  .join("\n");
                return reject(new Error("Invalid Swagger:\n" + error));
              }

              resolve("ok");
            });
          });
        });
    });
  });
});
