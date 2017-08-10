const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
// this option tell startey to look at the field of email and not username.
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy( localOptions, function (email, password, done) {
  // verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err)}
    if (!user) { return done(null, false) }

    // compare password - is password == to user.password?
    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err)}
      if (!isMatch) { return done(null, false)}

      return done(null, user);
    })
  })
})

// set up options for JWT Strategy
// we are telling strategy, when ever a request comes in, and we want
// passport to handle it needs to look at the request header,
// and specifically a header called 'authorization'.
// we should also tell it, which code to use to decode the token.
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
 };

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
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
