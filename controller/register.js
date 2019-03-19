var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;
// rounds=8 : ~40 hashes/sec
// rounds=9 : ~20 hashes/sec
// rounds=10: ~10 hashes/sec
// rounds=11: ~5  hashes/sec
// rounds=12: 2-3 hashes/sec
// rounds=13: ~1 sec/hash
// rounds=14: ~1.5 sec/hash
// rounds=15: ~3 sec/hash
// rounds=25: ~1 hour/hash
// rounds=31: 2-3 days/hash
var userModel = require('./../models/user-model');
var expressValidatorFormatter = require('./../models/express-validator-formatter');

// check login or NOt
router.get('*', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
});
router.post('*', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }
});

router.get('/', (req, res) => {

  res.render('registration/index', {
    title: "Registration here!!"
  });

});

router.post('/', (req, res) => {

  req.checkBody('uname', 'Username field cannot be empty.').notEmpty();
  req.checkBody('uname', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
  req.checkBody('uname', 'Username must be between 6-30 characters long.').len(6, 30);
  req.checkBody('email', 'The email you entered is invalid.').isEmail();
  req.checkBody('email', 'Email address must be between 6-60 characters long.').len(6, 60);
  req.checkBody('pass', 'Password must be between 8-60 characters long.').len(8, 60);
  req.checkBody("pass", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
  req.checkBody('repass', 'Re-enter Password must be between 8-60 characters long.').len(8, 100);
  req.checkBody('repass', 'Passwords do not match.').equals(req.body.pass);

  const errors = req.validationErrors();

  var data = {
    uname: req.body.uname,
    email: req.body.email,
    pass: req.body.pass,
    repass: req.body.repass
  }
  var emailErr = false;
  userModel.getID(data.email, function (results) {
    if (results.length > 0) {
      emailErr = true;
    }

    if (errors) {
      var values = expressValidatorFormatter.evFormatter(errors);
      if (emailErr) {
        var item = {};
        item["msg"] = "This email is already registered. ";
        values["email"] = item;
      }
      console.log(errors);
      console.log('After Formatting: ');
      console.log(values);
      res.render('registration/index', {
        title: "Registration Unsuccessful!!",
        errors: values,
        data: data
      });
    } else if (emailErr == true) {
      var values = {};
      var item = {};
      item["msg"] = "This email is already registered. ";
      values["email"] = item;
      res.render('registration/index', {
        title: "Registration Unsuccessful!!",
        errors: values,
        data: data
      });
    } else {

      bcrypt.hash(data.pass, saltRounds, function (err, hash) {

        var user = {
          uname: req.body.uname,
          email: req.body.email,
          hash: hash
        };

        userModel.insert(user, function (success) {
          if (success) {

            userModel.getTEU(user.email, function (results) {
              if (results.length > 0) {
                console.log('Login', results[0]);
                req.login(results[0], function (error) {
                  res.redirect('/');
                });
              }
            });

          } else {
            res.render("registration/index", {
              title: "Registration Unsuccessful!!"
            });
          }
        });

      });
    }


  });

});

module.exports = router;