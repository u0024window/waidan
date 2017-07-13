/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var path = require('path');
var DebtService = require('../../services/debt.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');

module.exports = wrap(function * (req, res, next) {
    var debtId = req.params.debtId;
    var HistoryTable = React.createFactory(require('views/debt/modify-history/history-table.jsx'));
    var Nav = React.createFactory(require('views/common/nav.jsx'));
    var reactOutput = [];

    var obj = yield Cache.get(req.cookies.uuid);
    var userName = obj.username || '';

    var result = yield DebtService.statusModifyList({
        debtId: debtId
    });

    if(result.error && 0 === +result.error.returnCode) {
        reactOutput.push(ReactServer.renderToString(Nav({navList: [
            {
                path: '/debt/list',
                name: '案件列表'
            },
            {
                path: `/debt/detail/${debtId}`,
                name: '案件详情'
            },
            {
                path: `/debt/modifyhistory/${debtId}`,
                name: '案件状态变更历史'
            }
        ]})));
        reactOutput.push(ReactServer.renderToString(HistoryTable({data: result.data})));
        res.render('debt/modify-history/index', {
            common: {
                userName: userName
            },
            reactOutput: reactOutput.join('')
        });
    }
    else {
        console.error('invoke api return exception');
        throw new Error('invoke api return exception');
    }
});


