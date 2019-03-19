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

	getUserBlogs: function (uid, callback) {
		var sql = "select * from blogs where uid=?";
		db.getResult(sql, [uid], function (result) {
			callback(result);
		});
	},
	getAll: function (callback) {
		var sql = "select * from blogs";
		db.getResult(sql, [], function (results) {
			callback(results);
		});
	},
	get: function (bid, callback) {
		var sql = "select * from blogs where bid=?";
		db.getResult(sql, [bid], function (results) {
			callback(results);
		});
	},
	insert: function (blog, callback) {
		var sql = "insert into blogs (uid,email,body,utype,date) values (?,?,?,?,?)";
		db.execute(sql, [blog.uid, blog.email, blog.body, blog.type, currentDate()], function (status) {
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



