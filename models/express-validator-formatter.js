/* express-validator-formatter */
module.exports = {
  evFormatter: function (arr) {
    // the var items will hold the msg
    var values = {};
    var cur = "";
    arr.forEach(function (err, i, arr) {
      if (cur === "") {
        cur = err.param;
        item = {};
        item["msg"] = "";
      }

      if (cur === err.param) {
        item["msg"] = item["msg"] + " " + err.msg;
      } else {
        values[cur] = item;
        cur = err.param;
        item = {};
        item["msg"] = "";
        item["msg"] = item["msg"] + " " + err.msg;
      }

      if (i === arr.length - 1) {
        values[cur] = item;
      }

    });

    return values;
  }
}

// var arr = [{ "location": "body", "param": "uname", "msg": "Username can only contain letters, numbers, or underscores.", "value": "test@asd.com" },
// { "location": "body", "param": "email", "msg": "The email you entered is invalid, please try again.", "value": "" },
// { "location": "body", "param": "email", "msg": "Email address must be between 4-60 characters long, please try again.", "value": "" },
// { "location": "body", "param": "repass", "msg": "Re-enter Password must be between 8-60 characters long.", "value": "" },
// { "location": "body", "param": "repass", "msg": "Passwords do not match, please try again.", "value": "" }];

// var formatter = new evFormatter();
// var values = formatter.formatErrors(arr);
// console.log(values.uname);
// console.log(values.email);
// console.log(values.repass);

