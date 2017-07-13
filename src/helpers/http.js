'use strict';
var JSON5 = require('json5');
var request = require('request');
var path = require('path');
var fs = require('fs');
var mockMapFile = path.join(process.cwd(), './mock/index.js');
var mockConfig = null;
var mockFile = null;
var serviceConfig = require('./config.js').service || {};
var serviceDomain = serviceConfig.service_domain;

if (fs.existsSync(mockMapFile)) {
    mockConfig = require('../../mock/index.js');
}

function httpRequest(params) {
    if (mockConfig && checkMockFile(params['url'])) {
        console.log("request mock service: ", params['url']);
        return new Promise((resolve, reject) => {
            fs.readFile(mockFile, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                try{
                    console.log(`response mock: ${JSON.stringify(JSON5.parse(data))}`);
                    resolve(JSON5.parse(data));
                }
                catch(e) {
                    console.log(mockFile, e);
                }
            });
        });
    }
    else {
        var options = {
            json: true,
            timeout: 10000
        };

        options.method = params.method || 'GET';
        options.url = params.url;
        options.formData = params.data;
        options.timeout = params.timeout || options.timeout;
        options.headers = {
            'content-type': 'application/x-www-form-urlencoded'
        }
        console.log("request service: ", options.url);

		return new Promise((resolve, reject) => {

			function callback(error, response, body) {
                if (error) {
                    console.error(`response ${options.url}`, error);
					reject(error);
                    return;
                }

				if (response.statusCode == 200) {
					if (typeof body === 'string') {
						body = JSON.parse(body);
					}
                    console.log(`response ${options.url}: ${JSON.stringify(body)}`);
					resolve(body);
				}
                else {
					reject(`response ${options.url}: ${response.statusCode}`);
				}
			}
			request(options, callback);
		});
	}
}

module.exports = httpRequest;


function checkMockFile(apiUrl) {
    if (apiUrl.startsWith(serviceDomain)) {
        apiUrl = apiUrl.substr(serviceDomain.length);
    }
    mockFile = (apiUrl && mockConfig[apiUrl]) ?
        mockFile = path.join(process.cwd(), './mock/', mockConfig[apiUrl]) :
        null;

    return null !== mockFile ? fs.existsSync(mockFile) : false;
}

