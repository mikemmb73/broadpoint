//this file holds all the code for the API in relation to employers
const Employer = require('../../models/employers');
const Job = require('../../models/jobs');
const Candidate = require('../../models/candidates');
const async = require('async');
var calls = [];

module.exports = {
        createCandidate: createCandidate,
        getCandidates: getCandidates,
        getOneCandidate: getOneCandidate,
        updateCandidate: updateCandidate,
        deleteCandidate: deleteCandidate
}

function createCandidate (req,res) {
    const candidate = new Candidate({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        //this should also only be an employer from the employer collection
        previousEmployer: req.body.previousEmployer,
        pay: req.body.pay,
        //this should be an array of predefined items from the 'requirements' collection
        abilities: JSON.parse(req.body.abilities)
    });

    //I should write middleware to verify all of the information above is valid
    console.log(req.body.abilities);
    //save the candidate
    candidate.save((err) => {
        if(err)
            res.send(err);

        res.json([{message: "Candidate created!"}, {id: candidate["_id"]}]);
    });
}

function getCandidates (req,res) {
    //find all of the candidates in the collection
    Candidate.find(function(err, candidates) {
        if (err)
            res.send(err);

        //send the response as json
        res.json(candidates);
    });
}

function getOneCandidate (req,res) {
    //find the candidate identified by the url
    Candidate.findById(req.params.candidateId, function(err, candidate) {
        if (err)
            res.send(err);

        //send the response as json
        res.json(candidate);
    });
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
                res.json([{message: 'Candidate updated!'},{fieldsChanged}]);
            });
        }else{
            result = null;
            res.json([{message: 'Candidate updated!'},{fieldsChanged}]);
        }
    });
}

//delete candidate

function deleteCandidate (req, res) {
    //find the employer by the slug
    Candidate.remove({_id: req.params.candidateId}, (err, candidate) => {
        if (err)
            res.send(err);
        //respond saying the employer was successfully deleted
        res.json({ message: 'Candidate successfully deleted' });
    });
}
