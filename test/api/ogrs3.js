const should = require('chai').should();
const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('api', () => {

  describe('/calculate', () => {

    describe('POST /calculate/ogrs3', () => {

      it('should return a 200 response when the request is valid', (done) => {

        app(config, log, (err, server) => {
          if (err) {
            return done(err);
          }

          request(server)
            .post('/calculate/ogrs3')
            .set('Accept', 'application/json')
            .send({
              gender: 'F',
              birthDate: '1972-09-09T00:00:00.000Z',
              convictionDate: '2009-09-09T00:00:00.000Z',
              firstSanctionDate: '1986-09-09T00:00:00.000Z',
              previousSanctions: 3,
              assessmentDate: '2015-09-15T00:00:00.000Z',
              currentOffenceType: 16,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('calculatorVersion');
              res.body.should.have.property('OGRS3');
              res.body.OGRS3.should.eql([ 0.10966125120067906, 0.20180313320047943 ]);
              res.body.should.have.property('OGRS3PercentileRisk');
              res.body.OGRS3PercentileRisk.should.eql([ 10.97, 20.18 ]);

              done();
            });
          });

      });

      it('should return a 500 response when gender is not known', (done) => {

        app(config, log, (err, server) => {
          if (err) {
            return done(err);
          }

          request(server)
            .post('/calculate/ogrs3')
            .set('Accept', 'application/json')
            .send({
              gender: 'Other',
              birthDate: '1989-04-22T00:00:00.000Z',
              convictionDate: '2013-02-20T00:00:00.000Z',
              firstSanctionDate: '2001-09-10T00:00:00.000Z',
              previousSanctions: 25,
              assessmentDate: '2013-03-31T00:00:00.000Z',
              currentOffenceType: 12,
            })
            .expect('Content-Type', /json/)
            .expect(500)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.have.property('code', 'SCHEMA_VALIDATION_FAILED');
              res.body.should.have.property('message',
                'Request validation failed: Parameter (body) failed schema validation');
              res.body.should.have.property('results'),
              res.body.results.should.have.property('errors'),

              done();
            });
          });
      });

    });

      describe('POST /calculate/ogrs3/customised', () => {

        it('should return a 200 response when the request is valid', (done) => {

          app(config, log, (err, server) => {
            if (err) {
              return done(err);
            }

            request(server)
              .post('/calculate/ogrs3/customised')
              .set('Accept', 'application/json')
              .send({
                gender: 'F',
                birthDate: '1972-09-09T00:00:00.000Z',
                convictionDate: '2009-09-09T00:00:00.000Z',
                firstSanctionDate: '1986-09-09T00:00:00.000Z',
                previousSanctions: 3,
                assessmentDate: '2015-09-15T00:00:00.000Z',
                currentOffenceFactor: 0.204960477,
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                should.not.exist(err);

                res.body.should.have.property('calculatorVersion');
                res.body.should.have.property('OGRS3');
                res.body.OGRS3.should.eql([ 0.10966125120067906, 0.20180313320047943 ]);
                res.body.should.have.property('OGRS3PercentileRisk');
                res.body.OGRS3PercentileRisk.should.eql([ 10.97, 20.18 ]);

                done();
              });
            });

        });

        it('should return a 500 response when currentOffenceFactor is not supplied', (done) => {

          app(config, log, (err, server) => {
            if (err) {
              return done(err);
            }

            request(server)
              .post('/calculate/ogrs3/customised')
              .set('Accept', 'application/json')
              .send({
                gender: 'F',
                birthDate: '1989-04-22T00:00:00.000Z',
                convictionDate: '2013-02-20T00:00:00.000Z',
                firstSanctionDate: '2001-09-10T00:00:00.000Z',
                previousSanctions: 25,
                assessmentDate: '2013-03-31T00:00:00.000Z',
                currentOffenceType: 12,
              })
              .expect('Content-Type', /json/)
              .expect(500)
              .end((err, res) => {
                should.not.exist(err);

                res.body.should.have.property('code', 'SCHEMA_VALIDATION_FAILED');
                res.body.should.have.property('message',
                  'Request validation failed: Parameter (body) failed schema validation');
                res.body.should.have.property('results'),
                res.body.results.should.have.property('errors'),

                done();
              });
            });
        });

      });

  });

});
