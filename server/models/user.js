const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our modal
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
// before saving a model, run this function.
userSchema.pre('save', function (next) {
  // the context of this function is this user.
  // this => get access to the user model.
  const user = this;

// generate a salt, then run callback.
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err) }

// hash (encryot) our password using the salt.
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err) }

// overwrite plain text password with ecrypted password.
      user.password = hash;
      next();
    })
  })
});

// Create the model class
const ModelClass = mongoose.model('user', userSchema);


// Export the modal
module.exports = ModelClass;
