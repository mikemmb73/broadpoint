const Job = require('../models/jobs');

module.exports = {
    showJobs: showJobs,
    seedJobs: seedJobs
};

function showJobs (req, res) {
        Job.find({}, (err,jobs) => {
            if(err){
                res.status(404);
                res.send("Found 0 Jobs");
            }

            res.render('pages/jobs', {jobs: jobs});
        });
}



// seed our db
function seedJobs (req, res) {
    // create events
    const jobs = [
        {name: "Backend Developer", employer: "Cobal Network Solutions", description:"A basic backend job at CNS", requirements: ["Node", "PHP"], cantidates: []},
        {name: "Frontend Developer", employer: "Broadpoint Group", description:"A basic frontend job at CNS", requirements: ["JS", "CSS", "HTML"], cantidates: []}
    ];
    // use the event model to insert/save
    for (job of jobs){
        var newJob = new Job(job);
        newJob.save();
    }

    res.send("jobs database seeded");
}
