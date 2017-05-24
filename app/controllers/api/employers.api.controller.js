//this file holds all the code for the API in relation to employers
const Employer = require('../../models/employers');
const Job = require('../../models/jobs');

module.exports = {
    createEmployer: createEmployer,
    getEmployers  : getEmployers,
}

function createEmployer(req,res) {
    //declare the new employer
    const employer = new Employer({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        description: req.body.description,
    });

    //save the new employer
    employer.save((err) => {
        if(err)
            res.send(err);

        res.json({ message: 'Employer ' + employer.name + ' created!'});
    });
}

//find all the employers and send them back in json
function getEmployers (req, res) {
    //find all of the employers
    Employer.find(function(err, employers) {
        if (err)
            res.send(err);

        res.json(employers);
    });
}

// single employer routes ------------------------------------------------------
function getOneEmployer (req, res){
    Employer.findOne({slug: req.params.employerSlug}, (err,employer) => {
        if(err){
            res.send(err);
        }
        //send the data as a JSON object
        res.json(employer);
    });

}
