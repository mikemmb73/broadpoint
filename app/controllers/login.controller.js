passport                = require('passport'),

module.exports = {
    login: login,
    signup: signup,
    logout: logout,
    profile: profile,
    processSignup: processSignup
};

function login (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/login.ejs', { message: req.flash('loginMessage') });
}

function signup (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
}

function processSignup (req,res) {
    passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });
}

function logout (req, res) {
        req.logout();
        res.redirect('/');
}

function profile (req, res) {
        res.render('pages/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
}
