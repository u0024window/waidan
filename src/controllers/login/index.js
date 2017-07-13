/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var path = require('path');
var Cache = require('../../helpers/redisCache.js');

module.exports.login = function (req, res, next) {
    var Form = React.createFactory(require('views/login/login-form.jsx'));
    var reactOutput =  ReactServer.renderToString(Form({name: 'react-server'}))
    res.render('login/index', {reactOutput: reactOutput, layout: 'layouts/blank'});
}
module.exports.logout = function (req, res, next) {
    Cache.expire(req.cookies.uuid, 0);
    res.redirect(`/login`);
}

