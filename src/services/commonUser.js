'use strict';

var http = require('../helpers/http.js');
var config = require('../helpers/config.js').service;
var wrapParams = require('../helpers/wrapParams.js');

module.exports.getUserInfo = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/user/getUserInfo`,
        data: data,
		method: 'POST'
	})
};

