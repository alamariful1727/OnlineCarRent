var express = require('express');
var router = express.Router();
var carModel = require('../models/car-model');
var expressValidatorFormatter = require('../models/express-validator-formatter');
var uploadModel = require('../models//upload-model');

router.get('/', function (req, res) {
  carModel.getAll(function (results) {
    if (results.length > 0) {
      console.log(results);
      res.render('car/index', {
        cars: results
      });
    }
  });
});

router.get('/myblogs', function (req, res) {
  carModel.getUserBlogs(req.user.uid, function (results) {
    if (results.length > 0) {
      // console.log(results);
      res.render('blog/index', {
        blogs: results
      });
    }
  });
});

router.get('/add', function (req, res, next) {
  if (req.isAuthenticated() == true) {
    if (req.user.type == 'admin') {
      next();
    } else {
      req.flash('error_msg', 'Sorry you are not a admin!!');
      res.redirect('/cars');
    }
  } else {
    req.flash('error_msg', 'Please login AS ADMIN to ADD CAR!!');
    res.redirect('/login');
  }
});

router.get('/add', function (req, res) {
  res.render('car/addcar');
});

router.post('/upload', (req, res) => {

  carModel.getLastID(function (results) {
    if (results.length > 0) {
      console.log(results[0]);

      var name = `car-pic-${results[0].cid}`;
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
              cid: results[0].cid,
              photo: req.file.filename
            };
            carModel.updateCarPicture(user, function (success) {
              if (success) {
                req.flash('success_msg', `CAR picture has been successfully uploaded!!`);
                res.send({
                  msg: 'File Uploaded!',
                  file: `uploads/${req.file.filename}`
                });
              }
            });

          }
        }
      });

    }
  });

});

router.post('/add', function (req, res) {

  req.checkBody('cname', 'name must be between 10-300 characters long.').len(5, 300);
  req.checkBody('cname', 'Name field cannot be empty.').notEmpty();
  req.checkBody('description', 'Description must be between 10-300 characters long.').len(5, 300);
  req.checkBody('hprice', 'Range must be between 1-10000 tk.').len(1, 10000);
  req.checkBody('wprice', 'Range must be between 1-10000 tk.').len(1, 70000);
  req.checkBody('category', 'Gender cannot be empty.').notEmpty();

  var errors = req.validationErrors();

  var data = {
    description: req.body.description,
    cname: req.body.cname,
    category: req.body.category,
    hprice: req.body.hprice,
    wprice: req.body.wprice
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);
    res.render('car/addcar', {
      errors: values,
      data: data
    });
  } else {
    carModel.insert(data, function (success) {
      if (success) {
        res.render("car/addcar", {
          tittle: "Now, add a picture of that car!!"
        });
      } else {
        res.render("car/addcar");
      }
    });
  }

});

router.post('/delete', (req, res) => {
  carModel.delete(req.body.bid, function (success) {
    if (success) {
      req.flash('error_msg', `${req.user.username} is recently deleted a blog .`);
      res.send({
        msg: true
      })
    } else {
      res.send({
        msg: false
      })
    }
  });
});

router.post('/update', (req, res) => {
  // console.log(req.body.blog);
  carModel.update(req.body.blog, function (success) {
    if (success) {
      req.flash('success_msg', `${req.user.username} recently updated a blog .`);
      res.send({
        msg: true
      })
    } else {
      res.send({
        msg: false
      })
    }
  });
});

module.exports = router;