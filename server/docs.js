const express = require('express');

const yaml = require('js-yaml');

const swaggerYaml = require('fs').readFileSync(require.resolve('../api/swagger/swagger.yaml'), 'utf8');
const swaggerObject = yaml.safeLoad(swaggerYaml);
const swaggerUi = require('swagger-ui-express');

module.exports = () => {
  const router = express.Router();
  router.get('/api-docs', (req, res) => {
    return res.json(swaggerObject);
  });
  router.get('/', swaggerUi.setup(swaggerObject));
  router.use('/', swaggerUi.serve);
  return router;
};
