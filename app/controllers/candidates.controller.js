const Employer = require('../models/employers');
const Job = require('../models/jobs');
const Candidate = require('../models/candidates');
const Requirement = require('../models/requirements');
//set up async requests
const async = require('async');
var calls = [];

module.exports = {
    showCandidates: showCandidates,
    addCandidate: addCandidate,
    processAddCandidate: processAddCandidate,
    assignCandidate: assignCandidate,
    processAssignCandidate: processAssignCandidate,
    showSingleCandidate: showSingleCandidate
}

// show all of the candidates
function showCandidates (req, res) {
    Candidate.find({}, (err,candidates) => {
        if (err){
            res.status(404);
            res.send("No candidates found");
        }

        res.render('pages/candidates', {candidates: candidates});
    });
}

function showSingleCandidate (req,res){
    Candidate.findOne({_id: req.params.id}, (err,candidate) => {
        if (err){
            res.status(404);
            res.send("No candidates found");
        }
        console.log(candidate);
        res.render('pages/singleCandidate', {candidate: candidate});
    });
}

// add a candidate, we need requirements to show all the possible skills a dev could have
function addCandidate (req,res) {
    Requirement.find({}, (err1, requirements) =>{
        if(err1)
            throw err1;
        Employer.find({}, (err, employers) => {
            if(err)
                throw err;
            res.render('pages/addCandidate', {requirements: requirements, employers: employers});
        });
    });
}

// process the addition of a new candidate
// requirements is an array of all the abilities of a candidate
// this code is taken from "processAddJob"
function processAddCandidate (req,res) {
    console.log(req.body);
    const candidate = new Candidate({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        previous: req.body.previous,
        pay: req.body.pay,
        abilities: req.body.requirements
    });

    candidate.save((err) => {
        if (err)
            throw err;
        res.redirect(`/jobs`);
    });
}

function assignCandidate (req,res) {
    Candidate.find({}, (err,candidates) => {
        if (err){
            res.status(404);
            res.send("No candidates found");
        }

        res.render('pages/assignCandidate', {candidates: candidates, id: req.params.id});
    });
}


function processAssignCandidate (req,res) {
    //the new candidates we need to link to this job
    var recievedCandidates = req.body.candidates;

    if (recievedCandidates > 1){
        for (thisCandidate of recievedCandidates){
                var thisId = thisCandidate;
                var ir = 0;
                //run this and wait for it to finish

                calls.push(function(callback) {
                    thisCandidateObj = null;
                    foundName = null;
                    foundId = null;
                    Candidate.findOne({_id: thisId}, function(err3, thisCandidateObj) {
                        if (err3)
                            return callback(err);
                        //this is passed into the result field of the callback when this finishes
                        foundName = thisCandidateObj.name;
                        foundId = thisCandidateObj._id;
                        var exportObj = {name: foundName, id: foundId}
                        //console.log("Name: " + foundName);
                        //console.log("ID: " + foundId);
                        /*
                        job.candidates.push(foundName);
                        job.candidateId.push(foundId);
                        */
                        callback(null, exportObj);
                    });
                });
        }
        //result is = to the last object passed by the callback above
        async.parallel(calls, function(err, result) {
            Job.findOne({_id: req.params.id}, (err,job) => {
                if (err)
                    throw err;
                //for some reason, this object is often multiple of the same result
                //use index = 0 to get the first object
                console.log("THE RESULT IS: " + result)
                //we have the name and the id, why not save them now
                job.candidates.push(result.name);
                job.candidateId.push(result.id);
                //job.candidates = result.candidates;
                //job.candidateId = result.candidateId;
                //console.log("SAVING....");
                //save the changes we just made
                job.save((err3) => {
                    if(err3)
                        console.log(err3);

                });
                //redirect back to the job we just assigned a user to
                //res.redirect('/jobs/' + job['_id']);
            });
        });

        res.redirect('/jobs');
    // if there is only one selected it is super easy im pretty damn sure
    }else {
        Candidate.findOne({_id: recievedCandidates}, (err3, thisCandidateObj) => {
            Job.findOne({_id: req.params.id}, (err,job) => {
                thisCandidateObj.leads.push(job.name);
                thisCandidateObj.leadIds.push(req.params.id);
                job.candidates.push(thisCandidateObj.name);
                job.candidateId.push(recievedCandidates);
                job.save((err3) => {
                    thisCandidateObj.save((err4) => {
                        if (err4)
                            console.log(err4);
                    });
                    if(err3)
                        console.log(err3);
                    console.log("Assinged Candidate " + recievedCandidates);
                    res.redirect('/jobs/' + job['_id']);
                });

            });

        });

    }
}
