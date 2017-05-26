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
    showSingleCandidate: showSingleCandidate,
    updateCandidate: updateCandidate,
    deleteCandidate: deleteCandidate
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

function updateCandidate (req,res) {
    callback = null;
    calls.push(function(callback) {
        Candidate.findById(req.params.candidateId, function(err, candidate) {
            if (err)
                res.send(err);

            var fieldsChanged = []
            console.log(req.body);

            if (req.body.name != null){
                fieldsChanged.push("Name");
                candidate.name = req.body.name;
            }

            if (req.body.phone != null){
                fieldsChanged.push("Phone");
                candidate.phone = req.body.phone;
            }

            if (req.body.address != null){
                fieldsChanged.push("Address");
                candidate.address = req.body.address;
            }

            if (req.body.email != null){
                fieldsChanged.push("Email");
                candidate.email = req.body.email;
            }

            if (req.body.previousEmployer != null){
                fieldsChanged.push("previousEmployer");
                candidate.previousEmployer = req.body.previousEmployer;
            }

            if (req.body.pay != null){
                fieldsChanged.push("pay");
                candidate.pay = req.body.pay;
            }

            if (req.body.abilities != null){
                fieldsChanged.push("abilities");
                candidate.abilities.push(req.body.abilities);
            }

            //in order to insert into the lead table, we need the job name and the job id
            if (req.body.leadId != null && req.body.lead != null){
                if (typeof(req.body.lead) != "object"){
                    //add the lead and the leadId to the respective arrays
                    fieldsChanged.push("leads");
                    fieldsChanged.push("leadId");
                    candidate.leadIds.push(req.body.leadId);
                    candidate.leads.push(req.body.lead);
                }else{
                    res.json([{message: "Can not add more than 1 lead at a time"}]);
                }
            }else if(req.body.leadId != null && req.body.lead == null){
                res.json([{message: "No value for lead field found"}]);
            }else if(req.body.leadId == null && req.body.lead != null){
                res.json([{message: "No value for leadId field found"}]);
            }


            //same thing as above but for skills/abilities
            if (req.body.ability != null){
                if (typeof(req.body.ability) != "object"){
                    //add the lead and the leadId to the respective arrays
                    fieldsChanged.push("ability");
                    candidate.abilities.push(req.body.ability);
                }else{
                    res.json([{message: "Can not add more than 1 ability at a time"}]);
                }
            }

            //save the candidate
            candidate.save((err) => {
                if(err)
                    console.log(err);

                //respond with a static response along with an array of the fields changed
                //res.json([{message: 'Candidate updated!'},{fieldsChanged}]);
                var candidateInfo = new Array();
                candidateInfo.push(candidate.name);
                candidateInfo.push(candidate["_id"]);
                candidateInfo.push(fieldsChanged);
                candidateInfo.push(req.body.leadId);
                for (field of req.body){
                    field = null;
                }

                callback(null, candidateInfo);
            });

        });
    });

    async.parallel(calls, function(err, result) {
        //name is stored 00, id is stored 01, changed fields is stored 02
        var name = result[0][0];
        var id = result[0][1];
        //last in this array is the job id to change
        var jobid = result[0][3];

        var fieldsChanged = result[0][2];

        //if the leads array was changed, make sure to update the job listing also
        if(result[0][2].indexOf("leads") != -1){
            Job.findById(jobid, function(err2, thisJob) {
                if (err2)
                    console.log(err2);
                thisJob.candidates.push(name);
                thisJob.candidateId.push(id);

                thisJob.save((err3) => {
                    if(err3)
                        console.log(err3);
                })
                result = null;
                res.redirect("/candidates/"+candidateId);
            });
        }else{
            result = null;
            res.redirect("/candidates/"+candidateId);
        }
    });
}

//delete candidate

function deleteCandidate (req, res) {
    //unlink this candidate from any jobs they may be linked to
    Job.find({}, (err,jobs) => {
        //console.log(jobs);
        for (job of jobs){
            //get the index of the candidate in the candidates array of this job
            var index = job.candidateId.indexOf(req.params.candidateId);
            if (index > -1){
                job.candidateId.splice(index, 1);
                job.candidates.splice(index,1);
                job.save((err2) => {
                    if(err2)
                        console.log(err2);
                });
            }
        }

    });
    //delte the actual candidate
    Candidate.remove({_id: req.params.candidateId}, (err, candidate) => {
        if (err)
            res.send(err);
        //respond saying the candidate was successfully deleted
        res.redirect("/candidates");
    });
}
