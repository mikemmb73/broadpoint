//this file holds all the code for the API in relation to employers
const Employer = require('../../models/employers');
const Job = require('../../models/jobs');

module.exports = {
    createEmployer: createEmployer,
    getEmployers  : getEmployers,
    getOneEmployer: getOneEmployer,
    updateEmployer: updateEmployer,
    deleteEmployer: deleteEmployer
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

        res.json({ message: 'Employer created!'});
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

//put function to update the employer data
function updateEmployer (req,res){
    Employer.findOne({slug: req.params.employerSlug}, (err,employer) => {
        if (err)
            res.send(err);

        var fieldsChanged = []

        //check if the request is trying to update something
        if (req.body.name != null){
            fieldsChanged.push("Name");
            employer.name = req.body.name;
        }

        if (req.body.phone != null){
            fieldsChanged.push("Phone");
            employer.phone = req.body.phone;
        }

        if (req.body.address != null){
            fieldsChanged.push("Address");
            employer.address = req.body.address;
        }

        if (req.body.description != null){
            fieldsChanged.push("Description");
            employer.description = req.body.description;
        }

        //save the new employer
        employer.save((err) => {
            if(err)
                res.send(err);

            //respond with a static response along with an array of the fields changed
            res.json([{message: 'Employer updated!'},{fieldsChanged}]);
        });
    });
}

//function to delete an employer
function deleteEmployer(req, res) {
    //find the employer by the slug
    Employer.remove({slug: req.params.employerSlug}, (err, employer) => {
        if (err)
            res.send(err);
        //respond saying the employer was successfully deleted
        res.json({ message: 'Successfully deleted' });
    });
}
