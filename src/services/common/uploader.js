var fs = require('fs-extra');
var multer = require('multer');

const TMP_NAME = './tmp/';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.ensureDirSync(TMP_NAME);
        cb(null, TMP_NAME)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

var upload = multer({
    storage: storage
})

module.exports = upload;
