//this file holds all the code for the API in relation to employers
const Employer = require('../../models/employers');
const Job = require('../../models/jobs');
const Candidate = require('../../models/candidates');

module.exports = {
        createCandidate: createCandidate,
        getCandidates: getCandidates,
        getOneCandidate: getOneCandidate
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

        res.json([{message: "Candidate created!"}]);
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
