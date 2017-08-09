const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// set uo options for JWT Strategy
const jwtOptions = { };

// create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // see if the user ID in the payload exists in out database
  // if it does, call 'done' with that user object
  // otherwise, call done without a user object
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, fasle) };

    if (user) { done(null, user) }

    else { done(null, false) }

  })

})

// tell passport to use this strategy
