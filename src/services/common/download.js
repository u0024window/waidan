var wrapParams = require('../../helpers/wrapParams.js');
var http = require('../../helpers/http.js');
var config = require('../../helpers/config.js').service;
var Cache = require('../../helpers/redisCache.js');
var request = require('request');

function httpRequest(params) {
    var options = {
        json: true,
        timeout: 3000
    };

    options.method = params.method || 'GET';
    options.url = params.url;
    options.formData = params.data;
    options.headers = {
        'content-type': 'application/x-www-form-urlencoded'
    }
    return request(options);
}


module.exports.download = function(data, fileName) {
    data.sign = wrapParams(data);
    console.log("download:", `${config.service_domain}/template/${fileName}`)
	return httpRequest({
		url: `${config.service_domain}/template/${fileName}`,
        data: data || {},
		method: 'POST'
	})
};