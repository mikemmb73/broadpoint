// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var userSchema = new mongoose.Schema({
    local            : {
          email        : String,
          password     : String
      },
      facebook         : {
          id           : String,
          token        : String,
          email        : String,
          name         : String
      },
      twitter          : {
          id           : String,
          token        : String,
          displayName  : String,
          username     : String
      },
      google           : {
          id           : String,
          token        : String,
          email        : String,
          name         : String
      }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Export the Mongoose model
module.exports = mongoose.model('User', userSchema);