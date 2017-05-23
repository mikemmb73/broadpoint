const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

//create a Schema
const jobSchema = new Schema({
        name: String,
        employer: String,
        employerSlug: String,
        slug: {
                type: String,
                unique: false
        },
        description: String,
        requirements: [String],
        candidates: [String]
});

//middleware ---------------

//make sure the slug is created from the name
jobSchema.pre('save', function(next) {
        this.slug = slugify(this.employer + "-" + this.name);
        this.employerSlug = slugify(this.employer);
        next();
});

//create the model
const jobModel = mongoose.model('Job', jobSchema);

//export the model
module.exports = jobModel;


// function to slugify a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
