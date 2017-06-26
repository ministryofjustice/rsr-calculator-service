const should = require('chai').should();
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('api', () => {

  describe('/health', () => {

    describe('GET /health', () => {

      it('should return a 200 response with some content', (done) => {
        app(config, log, (err, server) => {
          if (err) {
            return done(err);
          }

          request(server)
            .get('/health')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('healthy', true);
              res.body.should.have.property('checks');
              res.body.checks.should.have.property('calculatorVersion');

              done();
            });
        });

      });
    });
  });
});
