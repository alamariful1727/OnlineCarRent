var db = require('./db');
var dateFormat = require('dateformat');


module.exports = {

	getLastID: function (callback) {
		var sql = "SELECT uid FROM users ORDER BY uid DESC LIMIT 1;";

		db.getResult(sql, [], function (result) {
			console.log(result[0]);
			callback(result);
		});
	},
	get: function (uid, callback) {
		var sql = "select * from users where uid=?";

		db.getResult(sql, [uid], function (result) {
			callback(result);
		});
	},
	getTEU: function (uid, callback) {
		var sql = "select uid, type, username, email from users where email=?";

		db.getResult(sql, [uid], function (result) {
			callback(result);
		});
	},
	getID: function (email, callback) {
		var sql = "select uid from users where email=?";

		db.getResult(sql, [email], function (result) {
			callback(result);
		});
	},
	getAll: function (callback) {
		var sql = "select * from users";
		db.getResult(sql, [], function (results) {
			callback(results);
		});
	},
	validate: function (email, callback) {
		var sql = "select password, uid from users where email = ?";
		db.getResult(sql, [email], function (result) {
			callback(result);
		});
	},
	insert: function (user, callback) {
		var arr = dateFormat(new Date()).split(" "); //dateFormat(new Date()) = "Sat Jun 09 2007 17:46:21"
		var member = {
			wday: arr[0], //Sat
			month: arr[1],//Jun
			day: arr[2],  //09
			year: arr[3], //2007
			time: arr[4], //17:46:21
		}
		// console.log(member);
		var sql = "insert into users (username,email,password,type,member) values (?,?,?,?,?)";
		db.execute(sql, [user.uname, user.email, user.hash, "user", JSON.stringify(member)], function (status) {
			callback(status);
		});
	},
	update: function (user, callback) {
		var sql = "update users set username=?,password=?, type=? where uid=?";
		db.execute(sql, [user.uname, user.password, user.type, user.id], function (status) {
			callback(status);
		});
	},
	updateSettingsPass: function (user, callback) {
		var sql = "update users set password=? where uid=?";
		db.execute(sql, [user.hash, user.uid], function (status) {
			callback(status);
		});
	},
	updateProfilePicture: function (user, callback) {
		var sql = "update users set photo=? where uid=?";
		db.execute(sql, [user.photo, user.uid], function (status) {
			callback(status);
		});
	},
	updateSettingsCc: function (user, callback) {
		var sql = "update users set ccard=? where uid=?";
		console.log(user);
		db.execute(sql, [user.ccard, user.uid], function (status) {
			callback(status);
		});
	},
	updateSettingsPublicInfo: function (user, callback) {
		var sql = "update users set fname=?,lname=?,description=?,dob=?,phone=?,regionCode=?,country=?,blood=?,city=?,gender=?,occupation=?,address=? where uid=?";
		console.log(user);
		db.execute(sql, [user.fname, user.lname, user.description, user.dob, user.phone, user.regionCode, user.country, user.blood, user.city, user.gender, user.occupation, user.address, user.uid], function (status) {
			callback(status);
		});
	},
	updateSettingsAccount: function (user, callback) {
		var sql = "update users set username=?,remail=? where uid=?";
		console.log(user);
		db.execute(sql, [user.uname, user.remail, user.uid], function (status) {
			callback(status);
		});
	},
	updateSettingsSites: function (user, callback) {
		var sql = "update users set website=?,googleplus=?,facebook=?,twitter=?,instagram=? where uid=?";
		console.log(user);
		db.execute(sql, [user.website, user.googleplus, user.facebook, user.twitter, user.instagram, user.uid], function (status) {
			callback(status);
		});
	},
	delete: function (userId, callback) {
		var sql = "delete from users where id=?";
		db.execute(sql, [userId], function (status) {
			callback(status);
		});
	}
}



