const Employer = require('../models/employers');

module.exports = {
        showEmployers: (req, res) => {
            // res.send("The employers will be here");

            // add a place for data to be entered
            const employers = [
                {name: "CNS", slug: "cns", phone: "2066968408", address: "1920 Blenheim"},
                {name: "broadpoint", slug: "broadpoint", phone: "2063245226", address:  "capitol hill"}
            ];

            res.render('pages/employers', {employers : employers});
        }
};
