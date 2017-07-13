var md5 = require('md5');
var config = require('../helpers/config.js').service;

module.exports = function (srcData, ignoreFeild) {
    srcData.ts = +new Date();
    srcData.appId = 'outdebt_ui';
    var data = Object.assign({}, srcData);
    var keys = Object.keys(data);
    var r = [];
    keys = keys.sort();

    keys.forEach(function (key) {
		if (!ignoreFeild || key != ignoreFeild) {
			r.push(`${key}=${data[key]===undefined? '' : data[key]}`);
		}
    });
    r.push(config.service_token);
    r = r.join('|')
    console.log('request params:',r);

    return md5(r);
}

