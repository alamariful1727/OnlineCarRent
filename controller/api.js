var express = require('express');
var router = express.Router();
var blogModel = require('../models/blog-model');

router.get('*', function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
});

router.get('/blog/', function (req, res) {
	blogModel.getAll(function (results) {
		if (results.length > 0) {
			res.send(results);
		}
	});
});

router.get('/blog/:bid', function (req, res) {
	blogModel.get(req.params.bid, function (results) {
		if (results.length > 0) {
			res.send(results[0]);
		}
	});
});


module.exports = router;