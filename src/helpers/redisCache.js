var redis = require('redis');
var config = require('../helpers/config.js').service;

if ('dev' === process.env.NODE_ENV) {

    // global cache simple implementation
    function LocalRedis () {
        this._cache = {};
    }
    LocalRedis.prototype.get = function (key, callback) {
        callback(null, this._cache[key] || null);
    }
    LocalRedis.prototype.set = function (key, val, callback) {
        this._cache[key] = val;
        callback(null, true);
    }
    LocalRedis.prototype.expire = function (key, seconds, callback) {
        callback(null, true);
    }

    if (!global.client) {
        global.client = new LocalRedis();
    }
}
else {
    global.client = redis.createClient({
        host: config.redis_host,
        port: config.redis_port,
        retry_strategy: function (options){
            if (options.error.code === 'ECONNREFUSED') {
                return new Error('Redis the server refused the connection');
            }
            if (options.total_retry_time > 3000) { // 3s后，链接超时
                return new Error('Redis connect timeout');
            }
            return 1000; // 每1000毫秒重试链接
        }
    });
    global.client.on("error", function (err) {
        console.error("Redis connect Error " + err);
    });
}

function getPreKey(key) {
    if (config && config.redis_prefix) {

        return `${config.redis_prefix}_${key}`;
    }

    return key;
}

module.exports.get = function (key) {

    return new Promise(function (resolve, reject) {
        if (undefined !== key && null !== key) {
            global.client.get(getPreKey(key), function (err, res){
                if (err) {
                    reject(err);
                }
                else {
                    console.log(`get ${getPreKey(key)} from cache`, res);
                    resolve(JSON.parse(res));
                }
            });
        }
        else{
            reject(new Error('key is null'));
        }
    });
}

module.exports.set = function (key, obj, expireSeconds) {

    return new Promise(function (resolve, reject) {
        if (undefined !== key && null !== key) {
            console.log(`set ${getPreKey(key)} to cache`, obj);

            global.client.set(getPreKey(key), JSON.stringify(obj), function (err, rep) {
                if (err) {
                    reject(err);
                }
                else {
                    if (expireSeconds !== Infinity) {
                        module.exports.expire(key, expireSeconds).then(function (repp) {
                            resolve(repp)
                        })
                    }
                    else {
                        resolve(rep)
                    }
                }
            });
        }
        else {
            reject(new Error('key is null'));
        }
    });
}

module.exports.expire = function (key, seconds) {

    return new Promise(function (resolve, reject) {
        if (undefined === key || null === key) {

            reject(new Error('key is null'));
        }
        else {
            if (seconds === undefined || seconds === null) {
                seconds = config.redis_default_expire || 60 * 30;
            }

            global.client.expire(getPreKey(key), seconds, function (err, rep) {
                if (err) {
                    reject(err);
                }
                else {
                    console.log(`set ${getPreKey(key)} expire ${seconds} 秒`);
                    resolve(rep);
                }
            });
        }
    });
}
