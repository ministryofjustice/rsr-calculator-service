const should = require('chai').should();
const request = require('supertest');
const MongoInMemory = require('mongo-in-memory');
const app = require('../app.js');

describe('api', function () {
  describe('GET /ping', function () {

    describe('when environment variables not set', function () {
      var expects = {
        version: 'Not Available',
        date: 'Not Available',
        commit: 'Not Available',
        tag: 'Not Available',
      };

      it('returns "Not Available"', function (done) {

        request(app({}))
          .get('/ping')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.have.property('version_number', expects.version);
            res.body.should.have.property('build_date', expects.date);
            res.body.should.have.property('commit_id', expects.commit);
            res.body.should.have.property('build_tag', expects.tag);

            done();
          });

      });

    });

    describe('when environment variables set', function () {
      var expects = {
        version: '0.1.2',
        date: new Date().toString(),
        commit: 'afb12cb3',
        tag: 'test',
      };

      var env = {
        VERSION_NUMBER   : expects.version,
        BUILD_DATE       : expects.date,
        COMMIT_ID        : expects.commit,
        BUILD_TAG        : expects.tag,
      };

      it('returns JSON with app information', function (done) {

        request(app(env))
          .get('/ping')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.have.property('version_number', expects.version);
            res.body.should.have.property('build_date', expects.date);
            res.body.should.have.property('commit_id', expects.commit);
            res.body.should.have.property('build_tag', expects.tag);

            done();
          });

      });

    });

  });

  describe('GET /healthcheck', function () {
    beforeEach(function (done) {
      this.db = new MongoInMemory();

      this.db.start((error) => {
        if (error) {
          throw error;
        }

        this.VIPER_API_DATABASE = this.db.getMongouri('viper-heathchecks-test');

        done();
      });
    });

    afterEach(function (done) {
      this.db.stop((error) => {
        if (error) {
          throw error;
        }

        delete this.VIPER_API_DATABASE;

        done();
      });
    });

    describe('when a problem exists', function () {
      var expects = {
        checks: { database: false },
      };

      beforeEach(function () {
        this.server = app({});
      });

      it('returns the expected response report', function (done) {

        request(this.server)
          .get('/healthchecks')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(502)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.eql(expects);

            done();
          });
      });
    });

    describe('when everything is ok', function () {
      var expects = {
        checks: { database: true },
      };

      beforeEach(function () {
        this.server = app({ VIPER_API_DATABASE: this.VIPER_API_DATABASE });
      });

      it('returns the expected response report', function (done) {

        request(this.server)
          .get('/healthchecks')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.eql(expects);

            done();
          });

      });
    });

  });
});
