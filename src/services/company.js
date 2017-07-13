'use strict';

var http = require('../helpers/http.js');
var config = require('../helpers/config.js').service;
var wrapParams = require('../helpers/wrapParams.js');

module.exports.overdueRewardInfo = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/enterprise/overdueRewardInfo`,
        data: data,
		method: 'POST'
	})
};

module.exports.getCompanyList = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/enterprise/debt-list`,
        data: data,
		method: 'POST'
	})
};

module.exports.companyDetail = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/enterprise/detail`,
        data: data,
		method: 'POST'
	})
};

module.exports.companyModify = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/enterprise/modify`,
        data: data,
		method: 'POST'
	})
};

module.exports.companyAdd = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/enterprise/add`,
        data: data,
		method: 'POST'
	})
};
