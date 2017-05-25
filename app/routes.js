//create express router
const express = require('express'),
    //auth require
    passport                = require('passport'),
    authController          = require('./controllers/auth');

    //routes and such
    router                  = express.Router(),
    mainController          = require('./controllers/main.controller'),
    jobsController          = require('./controllers/jobs.controller'),
    candidateController     = require('./controllers/candidates.controller'),
    employersController     = require('./controllers/employers.controller'),
    employersAPIController  = require('./controllers/api/employers.api.controller'),
    candidatesAPIController = require('./controllers/api/candidates.api.controller');
    jobsAPIController       = require('./controllers/api/jobs.api.controller');
    userController          = require('./controllers/users.controller');


//export router so the other files can grab it
module.exports = router;

//define routes
//main route
router.get('/', mainController.showHome);

//job routes
router.get('/jobs', authController.isAuthenticated, jobsController.showJobs);
router.get('/jobs/addJob', authController.isAuthenticated, jobsController.addJob);
router.post('/jobs/addJob', authController.isAuthenticated, jobsController.processAddJob);

//employer routes
router.get('/employers', authController.isAuthenticated, employersController.showEmployers);
router.get('/employers/addEmployer', authController.isAuthenticated, employersController.addEmployer);
router.post('/employers/addEmployer', authController.isAuthenticated, employersController.processAddEmployer);

//candidate routes
router.get('/candidates', authController.isAuthenticated, candidateController.showCandidates);
router.get('/candidates/addCandidate', authController.isAuthenticated, candidateController.addCandidate);
router.post('/candidates/addCandidate', authController.isAuthenticated, candidateController.processAddCandidate);

// API BASED ROUTES ------------------------------------------------------------
    router.get('/api', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // employer API routes
    router.route('/api/employers')
        //post route
        .post(authController.isAuthenticated, employersAPIController.createEmployer)
        //get all route
        .get(authController.isAuthenticated, employersAPIController.getEmployers);

    // single employer API routes
    router.route('/api/employers/:employerSlug')
        .get(authController.isAuthenticated, employersAPIController.getOneEmployer)
        .put(authController.isAuthenticated, employersAPIController.updateEmployer)
        .delete(authController.isAuthenticated, employersAPIController.deleteEmployer);

    // candidate API
    router.route('/api/candidates')
        .post(authController.isAuthenticated, candidatesAPIController.createCandidate)
        .get(authController.isAuthenticated, candidatesAPIController.getCandidates);

    router.route('/api/candidates/:candidateId')
        .get(authController.isAuthenticated, candidatesAPIController.getOneCandidate)
        .put(authController.isAuthenticated, candidatesAPIController.updateCandidate)
        .delete(authController.isAuthenticated, candidatesAPIController.deleteCandidate);

    // job API
    router.route('/api/jobs')
        .get(authController.isAuthenticated, jobsAPIController.getJobs)
        .post(authController.isAuthenticated, jobsAPIController.createJob);

    router.route('/api/jobs/:jobId')
        .get(authController.isAuthenticated, jobsAPIController.getOneJob)
        .delete(authController.isAuthenticated, jobsAPIController.deleteJob)
        .put(authController.isAuthenticated, jobsAPIController.updateJob);

//user routes
// Create endpoint handlers for /users
router.route('/users')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);


//slug based routes that have to be at the end
router.get('/jobs/assignCandidate/:id', authController.isAuthenticated, candidateController.assignCandidate);
router.post('/jobs/assignCandidate/:id', authController.isAuthenticated, candidateController.processAssignCandidate);
router.get('/employers/:slug', authController.isAuthenticated, employersController.showOneEmployer);
router.get('/jobs/:id', authController.isAuthenticated, jobsController.singleJob);
router.get('/candidates/:id', authController.isAuthenticated, candidateController.showSingleCandidate);
