var date = require('locutus/php/datetime/date');
var moneyFormat = require('locutus/php/strings/money_format');
var setlocale = require('locutus/php/strings/setlocale')
var _ = require('lodash');
setlocale('LC_MONETARY', 'en_US')

module.exports.money = function (val) {
    if (!_.isNumber(val)) {

        return val;
    }

    return moneyFormat('%i', val/100).replace(/USD/g, '¥');
}

module.exports.datetime = function (val) {
    if (!_.isNumber(val)) {

        return val;
    }
    if (0 === val) {
        return '';
    }

    return date('Y-m-d H:i:s', val/1000);
}

module.exports.date = function (val) {
    if (!_.isNumber(val)) {

        return val;
    }
    if (0 === val) {
        return '';
    }

    return date('Y-m-d', val/1000);
}
