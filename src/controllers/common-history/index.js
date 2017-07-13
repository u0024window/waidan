/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');
var CommonHistoryService = require('../../services/commonHistory.js');
var cloneDeep = require('clone-deep');
var initDataString = require('../../helpers/initDataString.js');

module.exports = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid) || {};
    var userId = obj.userId;
    var userName = obj.username;
    var pageNo = req.query.pageNo || 1;
    var pageSize = req.query.pageSize || 20;
    var result = yield CommonHistoryService.query({
        userId: userId,
        businessId: req.query.businessId || userId,
        type: req.query.type,
        pageNo: pageNo,
        pageSize: pageSize
    });

    var Nav = React.createFactory(require('views/common/nav.jsx'));

    if ("TAX_LOG_TYPE" === req.query.type) {
        var navList = [
            {name: '费率设置', path: '/platform/rateconf'},
            {name: '操作记录', path: ''}
        ]
    }
    if ("ENTERPRISE_LOG_TYPE" === req.query.type) {
        var navList = [
            {name: '公司列表', path: '/company'},
            {name: '公司详情', path: '/company'},
            {name: '配置', path: '/company'},
            {name: '操作记录', path: '/company'}
        ]
    }
    var HistoryTable = React.createFactory(require('views/common-history/history-table.jsx'));
    var params = {
        data: result.data,
        pager: {
            pageNo: pageNo,
            pageSize: pageSize,
            total: result.data.total
        }
    }

    var cloneParams = cloneDeep(params);

    res.render('common-history/index', {
        common: {
            userName: userName
        },
        reactOutput: ReactServer.renderToString(Nav({navList: navList})),
        listTableOutput: ReactServer.renderToString(HistoryTable(cloneParams)),
        title: "操作历史",
        initData: initDataString(params)
    });
});

