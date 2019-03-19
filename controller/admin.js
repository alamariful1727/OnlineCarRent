var express = require('express');
var router = express.Router();
var userModel = require('./../models/user-model');
var uploadModel = require('../models//upload-model');
var expressValidatorFormatter = require('./../models/express-validator-formatter');
var bcrypt = require('bcrypt');
var saltRounds = 10;

var userInfo = {};
var p = "";

router.get('*', function (req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.type == 'admin') {
      next();
    } else {
      req.flash('error_msg', 'Sorry, Restricted for users!!');
      res.redirect('/');
    }
  } else {
    req.flash('error_msg', 'Please login first!!');
    res.redirect('/login');
  }
});

router.get('/', (req, res) => {
  res.render('admin/index');
});
router.get('/users', (req, res) => {
  userModel.getAll(function (results) {
    if (results.length > 0) {
      console.log(results.length);
      res.render('admin/users', {
        users: results // all users
      });
    }
  });
});
// ADD USERS
router.get('/adduser', (req, res) => {
  res.render('admin/adduser', { title: "Add new user!!" });
});
router.post('/adduser', (req, res) => {

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
      res.render('admin/adduser', {
        title: "Unsuccessful to add user!!",
        errors: values,
        data: data
      });
    } else if (emailErr == true) {
      var values = {};
      var item = {};
      item["msg"] = "This email is already registered. ";
      values["email"] = item;
      res.render('admin/adduser', {
        title: "Unsuccessful to add user!!",
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
            req.flash('success_msg', `Email: ${user.email} is added successfully.`);
            res.redirect('/admin/users');

          } else {
            res.render("admin/adduser", {
              title: "Unsuccessful to add user!!"
            });
          }
        });

      });
    }


  });

});
// EDIT USERS
router.get('/edituser/:id', (req, res) => {
  userModel.get(req.params.id, function (results) {
    if (results.length > 0) {
      userInfo['user'] = results[0];
      userInfo['member'] = JSON.parse(results[0].member);
      p = results[0].password.toString();
      res.render('admin/edituser', {
        user: results[0],
        member: JSON.parse(results[0].member)
      });
    } else {
      res.redirect('/admin/users');
    }
  });
});

// settings public-info
router.post('/edituser/publicInfo', (req, res) => {
  req.checkBody('fname', 'First name cannot be empty.').notEmpty();
  req.checkBody('lname', 'Last name cannot be empty.').notEmpty();
  req.checkBody('description', 'Description name cannot be empty.').notEmpty();
  req.checkBody('dob', 'DOB cannot be empty.').notEmpty();
  req.checkBody('phone', 'Phone cannot be empty.').notEmpty();
  req.checkBody('regionCode', 'Region Code cannot be empty.').notEmpty();
  req.checkBody('country', 'country cannot be empty.').notEmpty();
  req.checkBody('blood', 'Blood cannot be empty.').notEmpty();
  req.checkBody('city', 'City cannot be empty.').notEmpty();
  req.checkBody('gender', 'Gender cannot be empty.').notEmpty();
  req.checkBody('occupation', 'Occupation cannot be empty.').notEmpty();
  req.checkBody('address', 'Address cannot be empty.').notEmpty();
  req.checkBody('gender', 'Gender cannot be empty.').notEmpty();

  req.checkBody('fname', 'First name can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
  req.checkBody('fname', 'First name must be between 4-15 characters long.').len(4, 15);
  req.checkBody('lname', 'Last name can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
  req.checkBody('lname', 'Last name must be between 4-15 characters long.').len(4, 15);

  req.checkBody('description', 'Length must be between 15-150 characters long.').len(15, 150);
  req.checkBody('address', 'Length must be between 15-150 characters long.').len(15, 150);

  req.checkBody('phone', 'Length at least 11 characters long.').len({ min: 11 });
  // req.checkBody('phone', 'It must be a number.').isInt();

  req.checkBody('city', 'Length must be between 3-30 characters long.').len(3, 30);

  const errors = req.validationErrors();

  var data = {
    fname: req.body.fname,
    lname: req.body.lname,
    description: req.body.description,
    dob: req.body.dob,
    phone: req.body.phone,
    regionCode: req.body.regionCode,
    country: req.body.country,
    blood: req.body.blood,
    city: req.body.city,
    gender: req.body.gender,
    occupation: req.body.occupation,
    address: req.body.address,
    uid: userInfo.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);

    res.render('admin/edituser', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsPublicInfo(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `ID: ${userInfo['user'].uid} is updated recently.`);
        res.redirect("/admin/users");
      }
    });
  }

});
// settings private-info
router.post('/edituser/changepass', (req, res) => {

  req.checkBody('npass', 'New password must be between 8-60 characters long.').len(8, 60);
  req.checkBody("npass", "New password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
  req.checkBody('repass', 'Re-enter Password must be between 8-60 characters long.').len(8, 100);
  req.checkBody('npass', "New password don't match with Re-enter password.").equals(req.body.repass);

  const errors = req.validationErrors();

  var data = {
    password: req.body.password,
    hash: p,
    npass: req.body.npass,
    repass: req.body.repass,
    uid: userInfo.user.uid
  }
  var values = {};

  bcrypt.compare(data.password, data.hash, function (err, valid) {

    if (errors) {
      values = expressValidatorFormatter.evFormatter(errors);
      if (!valid) {
        var item = {};
        item["msg"] = "Enter a valid password. ";
        values["password"] = item;
      }
      console.log(values);
      res.render('admin/edituser', {
        user: userInfo['user'],
        member: userInfo['member'],
        errors: values,
        data: data
      });
    } else if (data.password === data.npass) {
      var item = {};
      item["msg"] = "New password can't be matched with Current password. ";
      values["npass"] = item;
      console.log("New password can't be matched with Current password. ");
      console.log(values);
      res.render('admin/edituser', {
        user: userInfo['user'],
        member: userInfo['member'],
        errors: values,
        data: data
      });
    } else if (!valid) {
      var item = {};
      item["msg"] = "Enter a valid password. ";
      values["password"] = item;

      console.log(values);
      res.render('admin/edituser', {
        user: userInfo['user'],
        member: userInfo['member'],
        errors: values,
        data: data
      });
    } else {
      bcrypt.hash(data.npass, saltRounds, function (err, hash) {
        var user = {
          hash: hash,
          uid: userInfo.user.uid
        };
        userModel.updateSettingsPass(user, function (success) {
          if (success) {
            console.log(success);
            req.flash('success_msg', `ID: ${userInfo.user.uid} is recently updated .`);
            res.redirect("/admin/users");
          }
        });
      });
    }
  });

});
// settings private-info
router.post('/edituser/cc', (req, res) => {
  req.checkBody('ccard', 'Enter a valid credit-card No...').len(17, 19);
  req.checkBody('type', "Enter a valid Type!! Example: 'admin' / 'user'").isIn(['admin', 'user', 'agency'])

  const errors = req.validationErrors();

  var data = {
    ccard: req.body.ccard,
    type: req.body.type,
    uid: userInfo.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);
    console.log(values);
    res.render('admin/edituser', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsCc(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `ID: ${userInfo.user.uid} is recently updated .`);
        res.redirect("/admin/users");
      }
    });
  }

});
// settings sites
router.post('/edituser/sites', (req, res) => {
  req.checkBody('facebook', 'Enter a valid Facebook link.').matches(/^(https?:\/\/){0,1}(www\.){0,1}facebook\.com/, 'i')
  req.checkBody('twitter', 'Enter a valid Twitter link.').matches(/^(https?:\/\/){0,1}(www\.){0,1}twitter\.com/, 'i')
  req.checkBody('instagram', 'Enter a valid Instagram link.').matches(/^(https?:\/\/){0,1}(www\.){0,1}instagram\.com/, 'i')
  req.checkBody('googleplus', 'Enter a valid Google-plus link.').matches(/^(https?:\/\/){0,1}(plus\.){0,1}google\.com/, 'i')

  const errors = req.validationErrors();

  var data = {
    website: req.body.website,
    facebook: req.body.facebook,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
    googleplus: req.body.googleplus,
    uid: userInfo.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);
    console.log(values);
    res.render('admin/edituser', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsSites(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `ID: ${userInfo.user.uid} is recently updated .`);
        res.redirect("/admin/users");
      }
    });
  }

});
// settings account
router.post('/edituser/account', (req, res) => {
  req.checkBody('uname', 'Username field cannot be empty.').notEmpty();
  req.checkBody('uname', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
  req.checkBody('uname', 'Username must be between 6-30 characters long.').len(6, 30);
  req.checkBody('remail', 'The email you entered is invalid.').isEmail();
  req.checkBody('remail', 'Email address must be between 6-60 characters long.').len(6, 60);

  const errors = req.validationErrors();

  var data = {
    uname: req.body.uname,
    remail: req.body.remail,
    uid: userInfo.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);

    res.render('admin/edituser', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsAccount(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `ID: ${userInfo.user.uid} is recently updated .`);
        res.redirect("/admin/users");
      }
    });
  }

});
// DELETE USERS
router.get('/deleteuser/:id', (req, res) => {
  userModel.get(req.params.id, function (results) {
    if (results.length > 0) {
      userInfo['user'] = results[0];
      userInfo['member'] = JSON.parse(results[0].member);
      p = results[0].password.toString();
      res.render('admin/deleteuser', {
        user: results[0],
        member: JSON.parse(results[0].member)
      });
    } else {
      res.redirect('/admin/users');
    }
  });
});
router.post('/deleteuser/:id', (req, res) => {
  userModel.delete(req.params.id, function (success) {
    if (success) {
      req.flash('success_msg', `ID: ${req.params.id} is recently deleted.. .`);
      res.redirect('/admin/users');
    } else {
      res.redirect("/admin/deleteuser/" + req.params.id);
    }
  });
});
module.exports = router;