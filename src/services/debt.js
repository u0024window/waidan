'use strict';

var http = require('../helpers/http.js');
var config = require('../helpers/config.js').service;
var Cache = require('../helpers/redisCache.js');
var wrapParams = require('../helpers/wrapParams.js');

module.exports.roundNoRefund = function(data, callback) {
    data.sign = wrapParams(data);
	return http({
		url: `${config.service_domain}/web/debt/roundNoRefund`,
        data: data || {},
        timeout: 30000,
		method: 'POST'
	})
};

module.exports.removeSuspectedRepeat = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/removeSuspectedRepeat`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.saveDetail = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/saveDetail`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.uploadHistory = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/uploadHistory`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.statusModifyList = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/status-modify-list`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.getDetail = function(data) {
    data.sign = wrapParams(data);

    return http({
        url: `${config.service_domain}/web/debt/detail`,
        data: data || {},
        method: 'POST'
    })
};


module.exports.getEnterpriseList = function(data) {
    data.sign = wrapParams(data);

    return http({
        url: `${config.service_domain}/web/enterprise/list`,
        data: data || {},
        method: 'POST'
    })
};

module.exports.getList = function(data) {
    data.sign = wrapParams(data);

    return http({
        url: `${config.service_domain}/web/debt/list`,
        data: data || {},
        method: 'POST'
    })
};

module.exports.getCloseReasons = function(data) {
    data = data || {};
    data.sign = wrapParams(data);

    return http({
        url: `${config.service_domain}/web/debt/close-reasons`,
        data: data || {},
        timeout: 30000,
        method: 'POST'
    })
};

module.exports.getCollRecodByPage = function(data) {
    data = data || {};
    data.sign = wrapParams(data);

    return http({
        url: `${config.service_domain}/web/debt/getCollRecodByPage`,
        data: data || {},
        method: 'POST'
    })
};

module.exports.close = function(data, callback) {
    data.sign = wrapParams(data);

    return http({
		url: `${config.service_domain}/web/debt/close`,
        data: data || {},
        timeout: 30000,
		method: 'POST'
	})
};

module.exports.sendToRrc = function(data, callback) {
    data.sign = wrapParams(data);

    return http({
		url: `${config.service_domain}/web/debt/send-to-rrc`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.collectRecordExport = function(data, callback) {
    data.sign = wrapParams(data);

    return http({
		url: `${config.service_domain}/web/debt/collectRecordExport`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.exception = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/exception`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.unexception = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/unexception`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.refundConfirm = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/refund-confirm`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.refund = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/refund`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.extendEntrustDate = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/debt/extend-entrust-date`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.refundPause = function(data, callback) {
    data.sign = wrapParams(data);
	
    return http({
		url: `${config.service_domain}/web/debt/refund-pause`,
        data: data || {},
		method: 'POST'
	})
};

module.exports.upload = function(data, callback) {
    data.sign = wrapParams(data, 'uploadFile');
    var params = {};

    /**
     * request formData 文件流字段必须放于谱图字段后
     * 否则可能丢失普通字段值
     **/
    Object.keys(data).forEach(function (item) {
        if (item !== "uploadFile") {
            params[item] = data[item];
        }
    });
    params['uploadFile'] = data['uploadFile'];

	http({
		url: `${config.service_domain}/web/debt/upload`,
        data: params || {},
        method: 'POST',
        timeout: 3 * 1000 * 60 // 3分钟
	}).then(function(ret) {
		callback(ret);
	});
};

var request = require('request');
var path = require('path');
var fs = require('fs');

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

module.exports.download = function(data) {
    data.sign = wrapParams(data);
	return httpRequest({
		url: `${config.service_domain}/web/enterprise/download`,
        data: data || {},
		method: 'POST'
	})
};
