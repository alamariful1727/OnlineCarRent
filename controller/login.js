var express = require('express');
var router = express.Router();
var passport = require('passport');

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

	res.render('login/index', {
		title: "Login Here!!"
	});

});

// Login
router.post('/', (req, res, next) => {

	passport.authenticate('local', {
		successRedirect: '/user/profile',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);

});

module.exports = router;