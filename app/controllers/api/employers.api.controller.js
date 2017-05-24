//this file holds all the code for the API in relation to employers
const Employer = require('../models/employers');
const Job = require('../models/jobs');

module.exports = {
    showEmployers: showEmployers,
    createEmployer: createEmployer,
    processAddEmployer: processAddEmployer
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

        res.json({ message: 'Bear created!'
    });
}
