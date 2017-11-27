const request = require('supertest');

const app = require('../../server/app');

const config = require('../../server/config');
const log = require('../../server/log');

describe('api /*', () => {
  let server;
  let paths = [];

  before((done) => {
    let specs = require('../../api/swagger/docs.js').paths;

    for (let p in specs) {
      paths.push({
        route: p,
        method: specs[p].get ? 'GET' : 'POST'
      });
    }

    app(config, log, (err, _server) => {
      if (err) return done(err);
      server = _server;
      done();
    });
  });

  it('should include the "X-Frame-Options" header in responses from each url', () => {
    return Promise.all(paths.map((path) =>
      request(server)[path.method.toLowerCase()](path.route)
        .set('Accept', 'application/json')
        .expect('X-Frame-Options', /Deny/)
    ));
  });

  it('should specify private cache control on routes', () => {
    return Promise.all(paths.map((path) =>
      request(server)[path.method.toLowerCase()](path.route)
        .set('Accept', 'application/json')
        .expect('cache-control', /no-store/)
        .expect('cache-control', /no-cache/)
        .expect('cache-control', /must-revalidate/)
        .expect('pragma', /no-cache/)
        .expect('expires', /0/)
    ));
  });
});
