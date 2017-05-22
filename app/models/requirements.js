const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

//create a Schema
const requirementSchema = new Schema({
        name: String
});

//middelware ---------------
//make sure the slug is created from the name
requirementSchema.pre('save', function(next) {
        this.slug = slugify(this.name);
        next();
});

//create the model
const requirementModel = mongoose.model('requirement', requirementSchema);

//export the model
module.exports = requirementModel;


// function to slugify a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
