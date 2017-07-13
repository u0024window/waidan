var fs = require('fs');
var path = require('path');
var JSON5 = require('json5');
var serverConfig = path.join(global.APP_PATH, './config/service.json');
var cache = {};

if (!cache[serverConfig]) {
    if (fs.existsSync(serverConfig)) {
        var data = fs.readFileSync(serverConfig, 'utf8');
        cache[serverConfig] = JSON5.parse(data);
    }
}

exports.service = cache[serverConfig] ? cache[serverConfig]: null;

