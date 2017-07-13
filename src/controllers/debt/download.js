var path = require('path');
var fs = require('fs');
var DebtService = require('../../services/debt.js');

module.exports = function (req, res, next) {
    DebtService.download({uploadId:req.params.uploadId}).pipe(res)
}
