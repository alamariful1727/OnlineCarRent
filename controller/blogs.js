var express = require('express');
var router = express.Router();
var blogModel = require('../models/blog-model');
var expressValidatorFormatter = require('../models/express-validator-formatter');

router.get('/', function (req, res) {
  blogModel.getAll(function (results) {
    if (results.length > 0) {
      console.log(results);
      res.render('blog/index', {
        blogs: results
      });
    }
  });
});

router.get('/myblogs', function (req, res) {
  blogModel.getUserBlogs(req.user.uid, function (results) {
    if (results.length > 0) {
      // console.log(results);
      res.render('blog/index', {
        blogs: results
      });
    }
  });
});

router.get('/add', function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error_msg', 'Please login for ADD blog!!');
    res.redirect('/login');
  }
});

router.get('/add', function (req, res) {
  res.render('blog/addblog');
});

router.post('/add', function (req, res) {
  req.checkBody('body', 'Description field cannot be empty.').notEmpty();
  req.checkBody('body', 'Description must be between 10-300 characters long.').len(10, 300);

  var errors = req.validationErrors();

  var data = {
    body: req.body.body,
    email: req.user.email,
    uid: req.user.uid,
    type: req.user.type
  }

  if (errors) {
    var values = expressValidatorFormatter.evFormatter(errors);
    // console.log(values);
    res.render('blog/addblog', {
      errors: values,
      data: data
    });
  } else {
    blogModel.insert(data, function (success) {
      if (success) {
        req.flash('success_msg', 'Thank you for sharing your experience!!');
        res.redirect('/blogs')
      } else {
        res.render("blog/addblog");
      }
    });
  }

});

router.post('/delete', (req, res) => {
  blogModel.delete(req.body.bid, function (success) {
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
  blogModel.update(req.body.blog, function (success) {
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