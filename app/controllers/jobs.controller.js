const Job = require('../models/jobs');
const Employer = require('../models/employers');
const Requirement = require('../models/requirements');

module.exports = {
    showJobs: showJobs,
    seedJobs: seedJobs,
    addJob: addJob,
    processAddJob: processAddJob,
    singleJob: singleJob
};

function showJobs (req, res) {
    Job.find({}, (err,jobs) => {
        if(err){
            res.status(404);
            res.send("Found 0 Jobs");
        }

        res.render('pages/jobs', {jobs: jobs});
    });
}

function singleJob (req, res) {
    Job.findOne({_id: req.params.id}, (err, theJob) => {
        if(err){
            res.status(404);
            res.send("Job not found");
        }
        Employer.findOne({slug: theJob.employerSlug}, (err2, employer) => {
            if(err2){
                res.status(404);
                res.send("Employer not found");
            }

            res.render('pages/singleJob', {job: theJob, employer: employer});
        });
    });
}

function addJob (req, res) {
    Requirement.find({}, (err1, requirements) =>{
        if(err1)
            throw err1;

        Employer.find({},(err,employers) => {
            if(err){
                res.status(404);
                res.send("Found 0 Employers");
                res.render("pages/addJob", {employers: {}});
            }
            res.render('pages/addJob', {employers : employers, requirements: requirements});
        });
    });
}

// process the job addition form
function processAddJob(req, res) {
    const job = new Job({
        name: req.body.name,
        description: req.body.description,
        employer: req.body.company,
        requirements: req.body.requirements

    });
    console.log(req.body.requirement);
    //save the job
    job.save((err) => {
        if(err)
            throw err;
        res.redirect(`/jobs/${job._id}`)
    });

}



// seed our db
function seedJobs (req, res) {
    // create events
    const jobs = [
        {name: "Backend Developer", employer: "Cobal Network Solutions", description:"A basic backend job at CNS", requirements: ["Node", "PHP"], candidates: []},
        {name: "Frontend Developer", employer: "Broadpoint Group", description:"A basic frontend job at CNS", requirements: ["JS", "CSS", "HTML"], candidates: []}
    ];
    // use the event model to insert/save
    for (job of jobs){
        var newJob = new Job(job);
        newJob.save();
    }

    res.send("jobs database seeded");
}
