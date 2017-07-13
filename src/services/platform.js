var http = require('../helpers/http.js');
var config = require('../helpers/config.js').service;
var wrapParams = require('../helpers/wrapParams.js');

module.exports.bonusTaxQuery = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/bonusTax/query`,
        data: data,
		method: 'POST'
	})
};
module.exports.bonusTaxModify = function(data, callback) {
    data.sign = wrapParams(data);

	return http({
		url: `${config.service_domain}/web/bonusTax/modify`,
        data: data,
		method: 'POST'
	})
};

