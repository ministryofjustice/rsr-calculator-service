const yaml = require('js-yaml');

const swaggerDoc = require('fs').readFileSync(require.resolve('../swagger/swagger.yaml'), 'utf8');

module.exports = yaml.safeLoad(swaggerDoc);
