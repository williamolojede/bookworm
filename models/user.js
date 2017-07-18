const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// create schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// authenticate input against database docs
UserSchema.statics.authenticate = function( email, password, callback ) {
  User.findOne({ email })
    .exec( function (err, user) {
      if (err) {
        return callback(err);
      } else if ( !user ) {
        const err = new Error('User not found.');
        err.status =  401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if( result === true ) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
}
// hash the password before saving to db
UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});
// create model out of schema
const User = mongoose.model('User', UserSchema);
module.exports = User;
