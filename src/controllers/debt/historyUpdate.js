/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var DebtService = require('../../services/debt.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');
var _ = require('lodash');

module.exports = wrap(function * (req, res, next) {
    var History = React.createFactory(require('views/debt/history-update/index.entry.jsx'));
    var reactOutput = [];

    var obj = yield Cache.get(req.cookies.uuid);
    var userName = obj.username || '';
    var userId = obj.userId || '';

    var result = yield DebtService.uploadHistory({
        userId: userId
    });

    if(0 !== +_.get(result, 'error.returnCode')) {
        throw new Error('invoke api return exception，' + _.get(result, 'error.returnUserMessage'));
    }
    reactOutput.push(ReactServer.renderToString(History({listData: _.get(result, 'data.debtUpdateList',[])})));
    res.render('debt/history-update/index', {
        common: {
            userName: userName
        },
        reactOutput: reactOutput.join('')
    });
});


