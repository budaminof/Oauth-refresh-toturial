const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// passport will try to create a session but since we are using a
// token we want session to be false;
// requireuth will be like some sort of middleware;
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false});

module.exports = function (app) {

  app.get('/', requireAuth,  function (req, res) {
    res.send({ hi: 'there'});
  });

  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup);

}
