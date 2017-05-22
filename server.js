require('dotenv').config();


//dependecies
const express = require('express'),
        app = express(),
        port = process.env.PORT || 8080,
        mongoose = require('mongoose'),
        expressLayouts = require('express-ejs-layouts'),
        bodyParser = require('body-parser');

//config app ====================
// tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

// set ejs
app.set('view engine', 'ejs');
app.use(expressLayouts)

//use bodyParser to accpet forms
app.use(bodyParser.urlencoded({extended: true}));

//connect to our database
mongoose.connect("mongodb://admin:password@ds064299.mlab.com:64299/broadpoint");

//set routes
app.use(require('./app/routes'));

//start server
app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
});
