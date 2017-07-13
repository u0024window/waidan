var redis = require("redis"),
    client = redis.createClient();

module.exports.getClient = function () {

    return client;
}



