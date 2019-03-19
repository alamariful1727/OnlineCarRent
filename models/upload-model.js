var multer = require('multer');
var path = require('path');
var dateFormat = require('dateformat');

module.exports = {

  photo: function (name) {

    // Set The Storage Engine
    var storage = multer.diskStorage({
      destination: './public/uploads/',
      filename: function (req, file, cb) {
        console.log(file);
        cb(null, "D4H" + '-' + name + path.extname(file.originalname));
      }
    });

    // Init Upload
    var upload = multer({
      storage: storage,
      limits: { fileSize: 5000000 },
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
      }
    }).single('profile');

    // Check File Type
    function checkFileType(file, cb) {
      // Allowed ext
      var filetypes = /jpeg|jpg|png|gif/;
      // Check ext
      var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check mime
      var mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: Images Only!');
      }
    }

    return upload;
  }
}