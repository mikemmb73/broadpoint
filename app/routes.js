//create express router
const express = require('express'),
    //auth require
    passport                = require('passport'),

    //routes and such
    router                  = express.Router(),
    mainController          = require('./controllers/main.controller'),
    jobsController          = require('./controllers/jobs.controller'),
    candidateController     = require('./controllers/candidates.controller'),
    employersController     = require('./controllers/employers.controller'),
    employersAPIController  = require('./controllers/api/employers.api.controller'),
    candidatesAPIController = require('./controllers/api/candidates.api.controller'),
    jobsAPIController       = require('./controllers/api/jobs.api.controller'),
    userController          = require('./controllers/users.controller'),
    loginController         = require('./controllers/login.controller');

//authController is for API
//loginController is for frontend


//export router so the other files can grab it
module.exports = router;

//define routes
//main route
router.get('/', isLoggedIn, mainController.showHome);

//job routes
router.get('/jobs', isLoggedIn, jobsController.showJobs);
router.get('/jobs/addJob', isLoggedIn, jobsController.addJob);
router.post('/jobs/addJob', isLoggedIn, jobsController.processAddJob);

//employer routes
router.get('/employers', isLoggedIn, employersController.showEmployers);
router.get('/employers/addEmployer', isLoggedIn, employersController.addEmployer);
router.post('/employers/addEmployer', isLoggedIn, employersController.processAddEmployer);

//candidate routes
router.get('/candidates', isLoggedIn, candidateController.showCandidates);
router.get('/candidates/addCandidate', isLoggedIn, candidateController.addCandidate);
router.post('/candidates/addCandidate', isLoggedIn, candidateController.processAddCandidate);
//get api endpoints (for html links)
router.get('/candidates/delete/:candidateId', candidateController.deleteCandidate);

// API BASED ROUTES ------------------------------------------------------------
    router.get('/api', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // employer API routes
    router.route('/api/employers')
        //post route
        .post(employersAPIController.createEmployer)
        //get all route
        .get(employersAPIController.getEmployers);

    // single employer API routes
    router.route('/api/employers/:employerSlug')
        .get(employersAPIController.getOneEmployer)
        .put(employersAPIController.updateEmployer)
        .delete(employersAPIController.deleteEmployer);

    // candidate API
    router.route('/api/candidates')
        .post(candidatesAPIController.createCandidate)
        .get(candidatesAPIController.getCandidates);

    router.route('/api/candidates/:candidateId')
        .get(candidatesAPIController.getOneCandidate)
        .put(candidatesAPIController.updateCandidate)
        .delete(candidatesAPIController.deleteCandidate);

    // job API
    router.route('/api/jobs')
        .get(jobsAPIController.getJobs)
        .post(jobsAPIController.createJob);

    router.route('/api/jobs/:jobId')
        .get(jobsAPIController.getOneJob)
        .delete(jobsAPIController.deleteJob)
        .put(jobsAPIController.updateJob);

//user routes
// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

//login routes
router.get('/login', loginController.login);
router.get('/signup', loginController.signup);
router.get('/logout', loginController.logout);
router.get('/profile', isLoggedIn, loginController.profile);
//post login routes
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));


//slug based routes that have to be at the end
router.get('/jobs/assignCandidate/:id',   candidateController.assignCandidate);
router.post('/jobs/assignCandidate/:id',   candidateController.processAssignCandidate);
router.get('/employers/:slug',   employersController.showOneEmployer);
router.get('/jobs/:id',   jobsController.singleJob);
router.get('/candidates/:id',   candidateController.showSingleCandidate);

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
