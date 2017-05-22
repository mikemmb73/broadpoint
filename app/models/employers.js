const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

//create a Schema
const employerSchema = new Schema({
        name: String,
        slug: {
                type: String,
                unique: true
        },
        address: String,
        phone: String,
        jobs: {}
});

//middelware ---------------
//make sure the slug is created from the name
employerSchema.pre('save', function(next) {
        this.slug = slugify(this.name);
        next();
});

//create the model
const employerModel = mongoose.model('Employer', employerSchema);

//export the model
module.exports = employerModel;


// function to slugify a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
