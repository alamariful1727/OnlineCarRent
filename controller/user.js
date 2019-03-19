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
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/profile', (req, res) => {
  //req.user.uid = uid
  userModel.get(req.user.uid, function (results) {
    if (results.length > 0) {
      // console.log(results[0]);
      res.render('user/profile', {
        user: results[0], // results[0].type
        member: JSON.parse(results[0].member) // String 'JSON object' -> JSON object
      });
    }
  });

});

router.get('/settings', (req, res) => {
  userModel.get(req.user.uid, function (results) {
    // console.log(results[0]);
    if (results.length > 0) {
      userInfo['user'] = results[0];
      userInfo['member'] = JSON.parse(results[0].member);
      p = results[0].password.toString();
      res.render('user/settings', {
        user: results[0],
        member: JSON.parse(results[0].member)
      });
    }
  });

});
// settings public-info
router.post('/settings/publicInfo', (req, res) => {
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
    uid: req.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);

    res.render('user/settings', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsPublicInfo(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `Public-info has been successfully updated!!`);
        res.redirect("/user/settings");
      }
    });
  }

});
// settings changepass
router.post('/settings/changepass', (req, res) => {

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
    uid: req.user.uid
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
      res.render('user/settings', {
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
      res.render('user/settings', {
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
      res.render('user/settings', {
        user: userInfo['user'],
        member: userInfo['member'],
        errors: values,
        data: data
      });
    } else {
      bcrypt.hash(data.npass, saltRounds, function (err, hash) {
        var user = {
          hash: hash,
          uid: req.user.uid
        };
        userModel.updateSettingsPass(user, function (success) {
          if (success) {
            console.log(success);
            req.flash('success_msg', `Password has been successfully changed!!`);
            res.redirect("/user/settings");
          }
        });
      });
    }
  });

});
// settings private-info
router.post('/settings/cc', (req, res) => {
  req.checkBody('ccard', 'Enter a valid credit-card No...').len(17, 19);
  req.checkBody('nid', 'Length should be 13-17.').len(13, 17);
  req.checkBody('passport', 'Length should be 7-9.').len(7, 9);

  const errors = req.validationErrors();

  var data = {
    ccard: req.body.ccard,
    nid: req.body.nid,
    passport: req.body.passport,
    uid: req.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);
    console.log(data);
    console.log(values);
    res.render('user/settings', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsCc(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `Private-info has been successfully updated!!`);
        res.redirect("/user/settings");
      }
    });
  }

});
// settings sites
router.post('/settings/sites', (req, res) => {
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
    uid: req.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);
    console.log(values);
    res.render('user/settings', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsSites(data, function (success) {
      if (success) {
        console.log(success);
        req.flash('success_msg', `Sites has been successfully updated!!`);
        res.redirect("/user/settings");
      }
    });
  }

});
// settings account
router.post('/settings/account', (req, res) => {
  req.checkBody('uname', 'Username field cannot be empty.').notEmpty();
  req.checkBody('uname', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
  req.checkBody('uname', 'Username must be between 6-30 characters long.').len(6, 30);
  req.checkBody('remail', 'The email you entered is invalid.').isEmail();
  req.checkBody('remail', 'Email address must be between 6-60 characters long.').len(6, 60);

  const errors = req.validationErrors();

  var data = {
    uname: req.body.uname,
    remail: req.body.remail,
    uid: req.user.uid
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);

    res.render('user/settings', {
      user: userInfo['user'],
      member: userInfo['member'],
      errors: values,
      data: data
    });
  } else {
    userModel.updateSettingsAccount(data, function (success) {
      if (success) {
        console.log(success);
        res.redirect("/user/settings");
      }
    });
  }

});

router.get('/upload', (req, res) => {
  res.render('user/upload');
});

router.post('/upload', (req, res) => {
  var name = `profile-pic-${req.user.uid}`;
  var upload = uploadModel.photo(name);

  upload(req, res, (err) => {
    console.log(res.file);
    if (err) {
      res.send({
        errMsg: err
      });
    } else {

      if (req.file == undefined) {

        res.send({
          errMsg: 'Error: No File Selected!'
        });

      } else {

        console.log(req.file.filename);
        var user = {
          uid: req.user.uid,
          photo: req.file.filename
        };
        userModel.updateProfilePicture(user, function (success) {
          if (success) {
            req.flash('success_msg', `Profile picture has been successfully changed!!`);
            res.send({
              msg: 'File Uploaded!',
              file: `uploads/${req.file.filename}`
            });
          }
        });

      }
    }
  });

});

module.exports = router;