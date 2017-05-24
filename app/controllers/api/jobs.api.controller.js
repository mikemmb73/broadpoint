//this file holds all the code for the API in relation to jobs
const Employer = require('../../models/employers');
const Job = require('../../models/jobs');
const Candidate = require('../../models/candidates');

//export all the functions that are defined
module.exports = {
    getJobs: getJobs,
    getOneJob: getOneJob
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
