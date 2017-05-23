const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

//create a Schema
const candidateSchema = new Schema({
        name: String,
        address: String,
        phone: String,
        email: String,
        previous: String,
        previousSlug: String,
        pay: String,
        abilities: [String],
        leads: [String]
});

//middleware ------------------------------------------------------------
candidateSchema.pre('save', function(next) {
        this.previousSlug = slugify(this.previous);
        next();
});

//create the model ------------------------------------------------------
const candidateModel = mongoose.model('Candidate', candidateSchema);

//export the model ------------------------------------------------------
module.exports = candidateModel;


// function to slugify a name -------------------------------------------
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
