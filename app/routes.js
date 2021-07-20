'use strict';

const Router = require('koa-router');
const miscController = require('./controllers/misc');
const jobController = require('./controllers/jobs');


const router = new Router();
router.get('/', miscController.getApiInfo);
router.get('/spec', miscController.getSwaggerSpec);
router.get('/status', miscController.healthcheck);
router.post('/new_job', jobController.newJob);

module.exports = router;
