//this file holds all the code for the API in relation to jobs
const Employer = require('../../models/employers');
const Job = require('../../models/jobs');
const Candidate = require('../../models/candidates');

//export all the functions that are defined
module.exports = {
    getJobs: getJobs,
    getOneJob: getOneJob,
    deleteJob: deleteJob,
    updateJob: updateJob,
    createJob: createJob
};

function getJobs (req,res) {
    //find all of the candidates in the collection
    Job.find(function(err, jobs) {
        if (err)
            res.send(err);

        //send the response as json
        res.json(jobs);
    });
}

function getOneJob (req,res) {
    //find the candidate identified by the url
    Job.findById(req.params.jobId, function(err, job) {
        if (err)
            res.send(err);

        //send the response as json
        res.json(job);
    });
}

function deleteJob (req,res) {
    //find the employer by the slug
    Job.remove({_id: req.params.jobId}, (err, job) => {
        if (err)
            res.send(err);
        //respond saying the employer was successfully deleted
        res.json({ message: 'Job successfully deleted' });
    });
}

function updateJob (req,res){
    Job.findById(req.params.jobId, function(err,job){
        if (req.body.name != null){
            fieldsChanged.push("Name");
            job.name = req.body.name;
        }

        if (req.body.employer != null){
            fieldsChanged.push("Employer");
            job.employer = req.body.employer;
        }

        if (req.body.description != null){
            fieldsChanged.push("Description");
            job.description = req.body.description;
        }

        //same thing as above but for requirements
        if (req.body.requirements != null){
            if (typeof(req.body.requirement) != "object"){

                fieldsChanged.push("requirement");
                job.requirement.push(req.body.requirement);
            }else{
                res.json([{message: "Can not add more than 1 requirement at a time"}]);
            }
        }

        job.save((err) => {
            if(err)
                console.log(err);

            res.json([{message: 'Job updated!'},{fieldsChanged}]);
        });
    });
}

function createJob (req,res){
    const job = new Job({
        name: req.body.name,
        //this should be verified at some point
        employer: req.body.employer,
        description: req.body.description,
        //this should be an array of predefined items from the 'requirements' collection
        requirements: JSON.parse(req.body.requirements)
    });

    //I should write middleware to verify all of the information above is valid

    //save the job
    job.save((err) => {
        if(err)
            res.send(err);

        res.json([{message: "Job created!"}]);
    });
}
