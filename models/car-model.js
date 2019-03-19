var db = require('./db');
var dateFormat = require('dateformat');

var currentDate = function () {
	var arr = dateFormat(new Date()).split(" "); //dateFormat(new Date()) = "Sat Jun 09 2007 17:46:21"
	var cd = {
		wday: arr[0], //Sat
		month: arr[1],//Jun
		day: arr[2],  //09
		year: arr[3], //2007
		time: arr[4], //17:46:21
	}
	var s = cd.month + ' ' + cd.day + ', ' + cd.year;
	return s;
}

module.exports = {

	getLastID: function (callback) {
		var sql = "SELECT cid FROM cars ORDER BY cid DESC LIMIT 1;";

		db.getResult(sql, [], function (result) {
			console.log(result[0]);
			callback(result);
		});
	},
	updateCarPicture: function (user, callback) {
		var sql = "update cars set photo=? where cid=?";
		db.execute(sql, [user.photo, user.cid], function (status) {
			callback(status);
		});
	},
	getUserBlogs: function (uid, callback) {
		var sql = "select * from blogs where uid=?";
		db.getResult(sql, [uid], function (result) {
			callback(result);
		});
	},
	getAll: function (callback) {
		var sql = "select * from cars";
		db.getResult(sql, [], function (results) {
			callback(results);
		});
	},
	get: function (cid, callback) {
		var sql = "select * from cars where cid=?";
		db.getResult(sql, [cid], function (results) {
			callback(results);
		});
	},
	insert: function (car, callback) {
		var sql = "insert into cars (cname,description,category,hprice,wprice) values (?,?,?,?,?)";
		db.execute(sql, [car.cname, car.description, car.category, car.hprice, car.wprice], function (status) {
			callback(status);
		});
	},
	update: function (blog, callback) {
		var sql = "update blogs set body=?, date=? where bid=?";
		db.execute(sql, [blog.body, currentDate(), blog.bid], function (status) {
			callback(status);
		});
	},
	delete: function (bid, callback) {
		var sql = "delete from blogs where bid=?";
		db.execute(sql, [bid], function (status) {
			callback(status);
		});
	}
}



