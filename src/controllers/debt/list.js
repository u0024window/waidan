/**
 * @overview
 *
 * @author * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var renderToString = ReactServer.renderToString;
var path = require('path');
var DebtService = require('../../services/debt.js');
var CommonUserService = require('../../services/commonUser.js');
var initDataToString = require('../../helpers/initDataString.js');
var cloneDeep = require('clone-deep');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');
var _ = require('lodash');

const DEFAULT_PAGE_NO = 1;
const DEFAULT_PAGE_SIZE = 10;

function filterQuery(query) {
    var query = query || {};
    query.pageNo = query.pageNo ? query.pageNo : DEFAULT_PAGE_NO;
    query.pageSize = query.pageSize ? query.pageSize : DEFAULT_PAGE_SIZE;
    query.debtStatus = query.debtStatus === undefined ? '': query.debtStatus;
    query.enterpriseId = query.enterpriseId === undefined ? '': query.enterpriseId;
    
    query.debtContract = query.debtContract === undefined ? '': query.debtContract;
    query.entrustStatus = query.entrustStatus === undefined ? '0': query.entrustStatus;
    query.importStatus = query.importStatus === undefined ? '0': query.importStatus;

    query.debtSettleStatus = query.debtSettleStatus === undefined ? '': query.debtSettleStatus;
    query.batchNo = typeof query.batchNo === 'string' ? query.batchNo.trim() : '';
    query.debtName = typeof query.debtName === 'string' ? query.debtName.trim() : '';
    query.debtMobile = typeof query.debtMobile === 'string' ? query.debtMobile.trim() : '';
    query.debtIdentityId = typeof query.debtIdentityId === 'string' ? query.debtIdentityId.trim() : '';
    query.roundRefundAmountBegin = typeof query.roundRefundAmountBegin === 'string' ? query.roundRefundAmountBegin.trim() : '';
    query.roundRefundAmountEnd = typeof query.roundRefundAmountEnd === 'string' ? query.roundRefundAmountEnd.trim() : '';
    query.roundRefundAmountBegin = ('' !== query.roundRefundAmountBegin) ? query.roundRefundAmountBegin * 100 : '';
    query.roundRefundAmountEnd = ('' !== query.roundRefundAmountEnd) ? query.roundRefundAmountEnd * 100 : '';

    return query;
}
function getPagerData(pageNo, pageSize, total) {
    var pageNo = pageNo || DEFAULT_PAGE_NO; // 当前第几页
    var pageSize =  pageSize || DEFAULT_PAGE_SIZE; // 每页条数
    var total = total || 0; //总条数
    var totalPage = 0; // 总页数

    if (0 === total % pageSize) {
        totalPage = total / pageSize;
    }
    else {
        totalPage = Math.floor(total / pageSize) + 1;
    }

    return {
        pageNo: pageNo,
        pageSize: pageSize,
        total: total,
        totalPage: totalPage
    }
}

function checkResults(results) {
    results.forEach(function (res) {
        if ('0' !== String(_.get(res, 'error.returnCode'))) {
            throw Error(_.get(res, 'error.returnUserMessage'));
        }
    })
    return true;
}

module.exports = wrap(function * (req, res, next) {
    var Query = React.createFactory(require('views/debt/list/query.jsx'));
    var ListTable = React.createFactory(require('views/debt/list/listTable.jsx'));
    var Pager = React.createFactory(require('views/debt/list/pager.jsx'));
    var Operation = React.createFactory(require('views/debt/list/operation.jsx'));
    var Nav = React.createFactory(require('views/common/nav.jsx'));
    var uuid = req.cookies.uuid;
    var obj = yield Cache.get(uuid);
    var userId = obj['userId'];
    var userName = obj['username'] || '';

    req.query['userId'] = userId;

    var a = DebtService.getList(filterQuery(req.query));
    var b = DebtService.getEnterpriseList({
        userId: userId
    });

    var c = CommonUserService.getUserInfo({
        userId: userId
    });
    var results = yield [a, b, c];
    if (!checkResults(results)) {
        console.error('invok api return exception');
        throw new Error ('invok api return exception');
    }
    let listData = results[0].data;
    let pageData = getPagerData(req.query.pageNo, req.query.pageSize, listData.total);
    
    Object.assign(req.query, {
        roundRefundAmountBegin: ('' !== req.query.roundRefundAmountBegin) ?
                                    req.query.roundRefundAmountBegin / 100 : '',

        roundRefundAmountEnd:  ('' !== req.query.roundRefundAmountEnd) ?
                                    req.query.roundRefundAmountEnd / 100 : ''
    });

    let queryData = {
        query: req.query,
        enterpriseList: results[1].data

    }
    let queryOutput = renderToString(Query(cloneDeep(queryData)));
    let listOutput = renderToString(ListTable({data: cloneDeep(listData.list)}));
    let pagerOutput = renderToString(Pager(pageData));
    let operationOutput = renderToString(Operation({
        email: results[2].data.email

    }));
    let headDataOutput = initDataToString({
        query: queryData,
        pager: pageData,
        list: listData.list,
        email: results[2].data.email
    });
    let navOutput = renderToString(Nav({
        navList: [
            {
                path: '/debt/list',
                name: '案件列表'
            }
        ]
    }));
    res.render('debt/list/index', {
        common: {
            userName: userName
        },
        navOutput: navOutput,
        queryOutput: queryOutput,
        listOutput: listOutput,
        pagerOutput: pagerOutput,
        operationOutput: operationOutput,
        headDataOutput: headDataOutput,
    });
});


