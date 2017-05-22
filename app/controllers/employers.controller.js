const Employer = require('../models/employers');
const Job = require('../models/jobs');

module.exports = {
    showEmployers: showEmployers,
    showOneEmployer: showOneEmployer,
    seedEmployers: seedEmployers,
    addEmployer: addEmployer,
    processAddEmployer: processAddEmployer
}

function showEmployers (req, res) {
    // get all events
    // the employers var is loaded straight to the page
    Employer.find({},(err,employers) => {
        if(err){
            res.status(404);
            res.send("No Employers Found");
        }

        // render the employers list
        res.render('pages/employers', {employers : employers});
    });
}

function showOneEmployer (req, res){
    Employer.findOne({slug: req.params.slug}, (err,employer) => {
        if(err){
            res.status(404);
            res.send("Employer not found");
        }
        const employerName = employer.name;
        Job.find({employer: employerName}, (err, jobs)=> {
            if(err){
                res.render('pages/single', {employer: employer, jobs: {}});
            }

            res.render('pages/single', {employer: employer, jobs: jobs});
        });
    });

}


// seed our db
function seedEmployers (req, res) {
    // create events
    const employers = [
        {name: "Cobal Network Solutions", phone: "2066968408", address: "1920 Blenheim"},
        {name: "Broadpoint Group", phone: "2063245226", address:  "capitol hill"}
    ];
    // use the event model to insert/save
    for (employer of employers){
        var newEmployer = new Employer(employer);
        newEmployer.save();
    }

    res.send("database seeded");
}

function addEmployer (req, res) {
    res.render('pages/addEmployer');
}

// process the job addition form
function processAddEmployer(req, res) {
    const employer = new Employer({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        description: req.body.description,
    });

    //save the job
    employer.save((err) => {
        if(err)
            throw err;
        res.redirect(`/employers/${employer.slug}`)
    });
}
