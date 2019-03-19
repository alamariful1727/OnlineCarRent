var express = require('express');
var router = express.Router();
var carModel = require('../models/car-model');

router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		console.log(`type: ${req.user.type}`);
		console.log(`User: ${req.user.uid}`);
		console.log(`AUTH: ${req.isAuthenticated()}`);
	} else {
		console.log(`AUTH: ${req.isAuthenticated()}`);
	}
	carModel.getAll(function (results) {
		if (results.length > 0) {
			console.log(results);
			res.render('home/index', {
				cars: results,
				title: "Online Car Rent"
			});
		}
	});
});

router.get('/contact-us', (req, res) => {
	res.render('home/contact-us');
});


module.exports = router;