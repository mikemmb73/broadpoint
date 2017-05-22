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

//job routes
router.get('/jobs', jobsController.showJobs);
router.get('/jobs/addJob', jobsController.addJob);
router.post('/jobs/addJob', jobsController.processAddJob);
router.get('/jobs/:id', jobsController.singleJob);
//employer routes
router.get('/employers', employersController.showEmployers);
router.get('/employers/seed', employersController.seedEmployers);
router.get('/employers/:slug', employersController.showOneEmployer);
