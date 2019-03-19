var mysql = require('mysql');
var config = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'online_car_rent'
}

function getConnection(callback) {
  connection = mysql.createConnection(config);
  connection.connect(function (err) {
    if (err) {
      console.log(err.stack);
    }
    console.log('connection id : ' + connection.threadId);
  });
  callback(connection);
}

module.exports = {
  getResult: function (sql, params, callback) {
    getConnection(function (connection) {
      if (params == "") {
        connection.query(sql, function (err, result) {
          if (err) {
            callback([]);
          } else {
            callback(result);
          }
        });
      } else {
        connection.query(sql, params, function (err, result) {
          if (err) {
            callback([]);
          } else {
            callback(result);
          }
        });
      }
      connection.end(function (error) {
        console.log('connection ending !!');
      });
    });
  },
  execute: function (sql, params, callback) {

    getConnection(function (connection) {
      if (params == "") {
        connection.query(sql, function (err, status) {
          if (err) {
            callback(false);
          } else {
            callback(status);
          }
        });
      } else {
        connection.query(sql, params, function (err, status) {
          console.log(err);
          if (err) {
            callback(false);
          } else {
            callback(status);
          }
        });
      }
      connection.end(function (error) {
        console.log('connection ending !!');
      });
    });
  }
}




