var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are successfully logged out!!');
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/');
  });

});
module.exports = router;