//create express router
const express = require('express'),
        router = express.Router(),
        mainController = require('./controllers/main.controller'),
        jobsController = require('./controllers/jobs.controller')
        employersController = require('./controllers/employers.controller');

//export router so the other files can grab it
module.exports = router;

//define routes
router.get('/', mainController.showHome);
router.get('/jobs', jobsController.showJobs);
router.get('/jobs/seed', jobsController.seedJobs);
router.get('/employers', employersController.showEmployers);
router.get('/employers/seed', employersController.seedEmployers);

//show individual employer
router.get('/employers/:slug', employersController.showOneEmployer);
