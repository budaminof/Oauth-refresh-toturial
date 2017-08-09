const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  // sub => jwt has sub property which is subject.
  // who is this about? the sub is this specific user.
}

exports.signup = function (req, res, next) {

  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
      error: 'You must provide email and password'
    })
  }
  // see if a user with a given email exists
  // using build in methods of Mongo
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err) };
    // if a user with email does exists - return error
    if( existingUser ) {
      return res.status(422).send({ error: 'Email is in use'});
    }
    // if a user with email DOES NOT exists, create and save record

    const user = new User({
      email: email,
      password: password
    });

    user.save(function (err) {
      if (err) { return next(err)};
      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user), user: user });
    });


  })

}
