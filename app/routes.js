//create express router
const express = require('express'),
        router = express.Router(),
        mainController = require('./controllers/main.controller'),
        jobsController = require('./controllers/jobs.controller'),
        candidateController = require('./controllers/candidates.controller'),
        employersController = require('./controllers/employers.controller'),
        employersAPIController = require('./controllers/api/employers.api.controller')

//export router so the other files can grab it
module.exports = router;

//define routes
router.get('/', mainController.showHome);

//job routes
router.get('/jobs', jobsController.showJobs);
router.get('/jobs/addJob', jobsController.addJob);
router.post('/jobs/addJob', jobsController.processAddJob);

//employer routes
router.get('/employers', employersController.showEmployers);
router.get('/employers/addEmployer', employersController.addEmployer);
router.post('/employers/addEmployer', employersController.processAddEmployer);

//candidate routes
router.get('/candidates', candidateController.showCandidates);
router.get('/candidates/addCandidate', candidateController.addCandidate);
router.post('/candidates/addCandidate', candidateController.processAddCandidate);

// API BASED ROUTES ------------------------------------------------------------
router.get('/api', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//employer API routes
router.route('/api/employers')
    //post route
    .post(employersAPIController.createEmployer)
    //get all route
    .get(employersAPIController.getEmployers);

//single employer API routes
router.route('/api/employers/:employerSlug')
    .get(employersAPIController.getOneEmployer)
    .put(employersAPIController.updateEmployer)
    .delete(employersAPIController.deleteEmployer);




//slug based routes that have to be at the end
router.get('/jobs/assignCandidate/:id', candidateController.assignCandidate);
router.post('/jobs/assignCandidate/:id', candidateController.processAssignCandidate);
router.get('/employers/:slug', employersController.showOneEmployer);
router.get('/jobs/:id', jobsController.singleJob);
router.get('/candidates/:id', candidateController.showSingleCandidate);
