/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var LoginService = require('../../services/login.js');
var md5 = require('md5');
var Cache = require('../../helpers/redisCache.js');
var config = require('../../helpers/config.js').service;
var wrap = require('../../helpers/controllerWrap.js');
var _ = require('lodash');

module.exports.check = wrap(function * (req, res, next) {
    var param = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    var result = yield LoginService.checkUser(param);

    if (0 === +_.get(result, 'error.returnCode') && _.get(result, 'data.userId')) {
        var uuid = result.data.userId;
        res.cookie('uuid', uuid, {
            maxAge: 365*24*60*60*1000,
            httpOnly: true,
            domain: req.hostname,
            path: '/',
        });
        Cache.set(uuid, result.data);
    }
    res.send(result);
});

var ajaxResult = {
    error : {
        "returnCode": -1,
        "returnMessage": "login fail",
        "returnUserMessage": "没有登录"
    },
    data: null
}
module.exports.loginAuthen = wrap(function * (req, res, next) {
    var uuid = req.cookies.uuid;
    console.info('entry loginAuthen....,',`loginAuthen get uuid: ${uuid}`);

    if (uuid) {
        var obj = yield Cache.get(uuid);
        if (obj) {
            Cache.expire(uuid)
            next();
        }
        else {
            sendResult(req, res);
        }
    }
    else {
        sendResult(req,res);
    }
});

function sendResult(req, res) {
    var isAjaxRequest = req.xhr;
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var url = encodeURIComponent(fullUrl);

    if (isAjaxRequest) {
        res.json(ajaxResult)
    }
    else {
        res.redirect(`/login?redirect=${url}`)
    }
}
