const request = require('supertest');
const should = require('chai').should();

const app = require('../../../server/app');

const config = require('../../../server/config');
const log = require('../../../server/log');

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
      .expect(200)
      .expect('Content-Type', /octet-stream/);
  });

  [
    'offenderTitle',
  /*  'firstName',
    'familyName',
    'pncId',
    'deliusId',
    'rsrType',*/
  ].forEach((property) => {
    it(`should include ${property} in response`, () => {
      let testString = '___TEST_DATA___';

      return request(server)
        .post('/render')
        .set('Accept', 'text/plain')
        .send({ [property]: testString })
        .then((response) => {
          should.not.exist(response.body.error);
          new Buffer(response.body).toString('utf8').should.match(new RegExp(`${property}: ${testString}`, 'igm'));
        });
    });
  });

  [
    'sexualElement',
  /*  'strangerVictim',
    'sexualOffenceHistory',
    'oasysInterview',
    'useWeapon',
    'domesticViolence',
    'murder',
    'wounding',
    'kidnapping',
    'firearmPossession',
    'robbery',
    'burglary',
    'anyOtherWeaponOffence',
    'endagerLife',
    'arson',*/
  ].forEach((property) => {
    it(`should include Yes in response for ${property} = 0`, () => {
      return request(server)
        .post('/render')
        .set('Accept', 'text/plain')
        .send({ [property]: 0 })
        .then((response) => {
          should.not.exist(response.body.error);
          new Buffer(response.body).toString('utf8').should.match(new RegExp(`${property}: yes`, 'igm'));
        });
    });

    it(`should include No in response for ${property} = 1`, () => {
      return request(server)
        .post('/render')
        .set('Accept', 'text/plain')
        .send({ [property]: 1 })
        .then((response) => {
          should.not.exist(response.body.error);
          new Buffer(response.body).toString('utf8').should.match(new RegExp(`${property}: no`, 'igm'));
        });
    });
  });

  it('should include category in response for currentOffenceType = 0', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({ currentOffenceType: 0 })
      .then((response) => {
        should.not.exist(response.body.error);
        new Buffer(response.body).toString('utf8').should.match(new RegExp('currentOffenceType: Absconding/ bail', 'igm'));
      });
  });

  it('should include category in response for currentOffenceType = 4', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({ currentOffenceType: 4 })
      .then((response) => {
        should.not.exist(response.body.error);
        new Buffer(response.body).toString('utf8').should.match(new RegExp('currentOffenceType: Criminal damage', 'igm'));
      });
  });

  it('should include category in response for violentOffenceCategory = 0', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({ violentOffenceCategory: 0 })
      .then((response) => {
        should.not.exist(response.body.error);
        new Buffer(response.body).toString('utf8').should.match(new RegExp('violentOffenceCategory: Summary violence', 'igm'));
      });
  });

  it('should include category in response for violentOffenceCategory = 4', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({ violentOffenceCategory: 4 })
      .then((response) => {
        should.not.exist(response.body.error);
        new Buffer(response.body).toString('utf8').should.match(new RegExp('violentOffenceCategory: Other indictable violence', 'igm'));
      });
  });

  it('should include female in response for sex = 1', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({ sex: 1 })
      .then((response) => {
        new Buffer(response.body).toString('utf8').should.match(new RegExp('sex: female', 'igm'));
      });
  });

  it('should include male in response for sex = 0', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({ sex: 0 })
      .then((response) => {
        should.not.exist(response.body.error);
        new Buffer(response.body).toString('utf8').should.match(new RegExp('sex: male', 'igm'));
      });
  });

  it('should return a 400 response when possible non plain text value detected', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({
        emptyTag: '<>',
      })
      .expect(400)
      .expect('Content-Type', /json/);
  });

  it('should return a 400 response when script injection detected', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({
        plainInjection: '<script>alert("world");</script>',
      })
      .expect(400)
      .expect('Content-Type', /json/);
  });

  it('should return a 400 response when html encoded script injection detected', () => {
    return request(server)
      .post('/render')
      .set('Accept', 'text/plain')
      .send({
        encodedInjection: '12ruu57%3cscript%3ealert(1)%3c%2fscript%3epelne',
      })
      .expect(400)
      .expect('Content-Type', /json/);
  });
});
