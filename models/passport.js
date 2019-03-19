var LocalStrategy = require('passport-local').Strategy;
var userModel = require('./../models/user-model');
var bcrypt = require('bcrypt');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function (email, password, done) {

      var user = {
        email: email,
        password: password
      }
      console.log(user);

      userModel.validate(user.email, function (results) {

        if (results.length === 0) {
          return done(null, false, { message: 'Please enter a valid email!!' });
          // Passport will create a string named "error"
        } else {
          // console.log(results);
          var hash = results[0].password.toString();
          bcrypt.compare(user.password, hash, function (err, res) {
            if (res === true) {
              userModel.getTEU(user.email, function (results) {
                if (results.length > 0) {
                  console.log('valid', results[0]);
                  return done(null, results[0]); //req.user = id
                }
              });

            } else {
              return done(null, false, { message: 'Your password is not a valid one..' });
            }
          });

        }

      });

    }
  ));

  passport.serializeUser(function (uid, done) {
    done(null, uid);
  });

  passport.deserializeUser(function (uid, done) {
    done(null, uid);
  });
};