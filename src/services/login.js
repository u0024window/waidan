'use strict';

var http = require('../helpers/http.js');
var wrapParams = require('../helpers/wrapParams.js');
var config = require('../helpers/config.js').service;

module.exports.checkUser = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/user/login`,
        data: data,
		method: 'POST'
	})
};
