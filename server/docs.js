const express = require('express');
const router = express.Router();

const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const swaggerYaml = fs.readFileSync(require.resolve('../api/swagger/swagger.yaml'), 'utf8');
const swaggerObject = yaml.safeLoad(swaggerYaml);

router.get('/api-docs', (req, res) => res.json(swaggerObject));
router.get('/', swaggerUi.setup(swaggerObject));
router.use('/', swaggerUi.serve);

module.exports = router;
