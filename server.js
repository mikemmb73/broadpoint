require('dotenv').config();


//dependecies
const express = require('express'),
        app             = express(),
        port            = process.env.PORT || 8080,
        mongoose        = require('mongoose'),
        expressLayouts  = require('express-ejs-layouts'),
        bodyParser      = require('body-parser'),
        flash           = require('connect-flash'),
        passport        = require('passport');
        session         = require('express-session');

//config app ====================
// tell express where to look for static assets
app.use(express.static(__dirname + '/public'));
//yes

// set ejs
app.set('view engine', 'ejs');
app.use(expressLayouts)

//set up passport
// required for passport
app.use(session({ secret: 'broadbroadbroadpoint' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//use bodyParser to accpet forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connect to our database
mongoose.connect("mongodb://admin:password@ds064299.mlab.com:64299/broadpoint");

//set routes
app.use(require('./app/routes'));

//start server
app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
});
