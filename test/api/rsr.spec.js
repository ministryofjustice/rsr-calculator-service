//const fixtures = require('../../node_modules/rsr-calculator/test/data/data.json');

const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');
/*
const DATE_TYPE_FIELDS = [
  'birthDate',
  'convictionDate',
  'sentenceDate',
  'firstSanctionDate',
  'assessmentDate',
  'mostRecentSexualOffence'
];

const parseDate = (input) => {
  var parts = String.prototype.split.call(input || 'sample data', '-');
  return parts.length === 3 ? new Date(parts[0], parts[1]-1, parts[2]) : parts[0];
};

const cloneWithDateObjects = (x) => {
  var out = {};
  for (var key in x) {
    out[key] = ~DATE_TYPE_FIELDS.indexOf(key) ? parseDate(x[key]) : x[key];
  }
  return out;
};
*/
describe('api /calculate', () => {
  let server;
  before((done) => {
    app(config, log, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  it.skip('should return a 200 response when the request is valid', () => {
    return request(server)
      .post('/calculate')
      .set('Accept', 'application/json')
      .send({
        sex: '0',
        birthDate: '1970-01-01T00:00:00.000Z',
        assessmentDate: '2018-02-12T00:00:00.000Z',
        currentOffenceType: '4',
        convictionDate: '2010-01-01T00:00:00.000Z',
        sentenceDate: '2016-01-01T00:00:00.000Z',
        sexualElement: '1',
        violentOffenceCategory: '',
        strangerVictim: '',
        firstSanctionDate: '2004-01-01T00:00:00.000Z',
        allSanctions: 6,
        violentSanctions: 4,
        sexualOffenceHistory: '1',
        mostRecentSexualOffence: '2009-01-01T00:00:00.000Z',
        contactAdult: 2,
        contactChild: 0,
        indecentImage: 0,
        paraphilia: 0,
        oasysInterview: 1,
        useWeapon: '',
        accommodation: '',
        employment: '',
        relationship: '',
        currentUseOfAlcohol: '',
        bingeDrinking: '',
        impulsivity: '',
        temper: '',
        proCriminal: '',
        domesticViolence: '',
        murder: '',
        wounding: '',
        kidnapping: '',
        firearmPossession: '',
        robbery: '',
        burglary: '',
        anyOtherOffence: '',
        endangerLife: '',
        arson: ''
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        res.body.should.have.property('calculatorVersion');
        res.body.should.have.property('riskOfSeriousRecidivism');
        res.body.riskOfSeriousRecidivism.should.eql([ 0.005957884017114846, 0.010868670831811394 ]);
        res.body.should.have.property('RSRPercentileRisk');
        res.body.RSRPercentileRisk.should.eql([ 0.6, 1.09 ]);
      });
  });
/*
  it('should return a 200 response when the request is valid', () => {
    return request(server)
      .post('/calculate')
      .set('Accept', 'application/json')
      .send(cloneWithDateObjects({
        birthDate: '1989-10-11',
        sex: 0,
        currentOffenceType: 7,
        convictionDate: '2012-11-27',
        sentenceDate: '2012-05-18',
        sexualElement: 1,
        strangerVictim: 1,
        violentOffenceCategory: '',
        firstSanctionDate: '2003-08-26',
        previousSanctions: 5,
        violentSanctions: 3,
        sexualOffenceHistory: 1,
        mostRecentSexualOffence: null,
        contactAdult: 0,
        contactChild: 0,
        indecentImage: 0,
        paraphilia: 0,
        murder: 1,
        wounding: 1,
        burglary: 1,
        arson: 1,
        endagerLife: 1,
        kidnapping: 1,
        firearmPossession: 1,
        robbery: 1,
        anyOtherOffence: 1,
        oasysInterview: 0,
        useWeapon: 0,
        partner: 1,
        accommodation: 1,
        employment: 1,
        relationship: 1,
        domesticViolence: 1,
        currentUseOfAlcohol: 0,
        bingeDrinking: 0,
        impulsivity: 1,
        temper: 1,
        proCriminal: 0,
        assessmentDate: '2013-03-31'
      }))
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        res.body.riskOfSeriousRecidivism.should.eql([ 0.002065642546634054, 0.015089786100569201 ]);
      });
  });

  fixtures.forEach((x, i) => {
    it(`should correctly calculate the RSR for dataset ${i} <${x.testNumber}>`, () => {
      x = cloneWithDateObjects(x);

      console.log(x)

      return request(server)
        .post('/calculate')
        .set('Accept', 'application/json')
        .send(x)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          res.body.riskOfSeriousRecidivism.should.eql([ x.output_sv_static, x.output_sv_dynamic ]);
        });
    });

  });
*/
});
