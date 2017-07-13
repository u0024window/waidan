var React = require('react');
var ReactServer = require('react-dom/server');
var path = require('path');
var CompanyService = require('../services/company.js');
var date = require('locutus/php/datetime/date')
var initDataToString = require('../helpers/initDataString.js');
var Cache = require('../helpers/redisCache.js');
var wrap = require('../helpers/controllerWrap.js');
var cloneDeep = require('clone-deep');
var _ = require('lodash');

var _navFactory = React.createFactory(require('views/common/nav.jsx'));
var _titleFactory = React.createFactory(require('views/common/title.jsx'));
var _tableFactory = React.createFactory(require('views/common/table.jsx'));

module.exports.list = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var userName = obj.username || '';

    var data = yield CompanyService.getCompanyList({userId: userId});
    var dataList = data.data.list;
    for(var i in dataList) {
        dataList[i].operate = {
            operateType: 0,
            operateList: [{
                name: '详情', 
                href: '/company/detail?enterpriseId='+dataList[i].enterpriseId
            }]
        };
    }

    var table = _tableFactory({
        thead: [
            {name: '公司名称', value: 'enterpriseName', style: {width: '200px'}},
            {name: '委托案件总量', value: 'debtTotalNum'}, 
            {name: '当前委托案件量', value: 'debtCurrentNum'}, 
            {name: '委托案件总额', value: 'debtTotalAmount', type: 'money'}, 
            {name: '当前委托案件金额', value: 'debtCurrentAmount', type: 'money'}, 
            {name: '最近委托案件日期', value: 'debtLastCreateDate', type: 'date'}, 
            {name: '最近案件更新日期', value: 'debtLastUpdateDate', type: 'date'},
            {name: '操作', value: 'operate'}
        ],
        tbody: dataList
    });

    var nav = _navFactory({
        navList: [
            {name: '公司列表', path: '/company'}
        ]
    });

    var title = _titleFactory({
        title:'公司列表',
        operateList: [
            {name: '新增公司', href: '/company/new'}
        ]
    });

    res.render('company/list/index', {
        common: {
            userName: userName
        },
        pageTitle: '公司列表',
        reactOutput: [
            ReactServer.renderToString(nav),
            ReactServer.renderToStaticMarkup(title),
            ReactServer.renderToString(table)
        ].join('')
    });
});
function filterRefundHistory (data) {
    var data = data || {};
    var list = data.list || [];
    var total = data.total;
    const refundTypeMap = {
        0: '线下结算'
    }

    list.map (function (item) {
        item['refundType'] = refundTypeMap[item['refundType']];

        return item;
    });
    if (total) {
        list.push({
            refundDate: '合计',
            refundAmount: total.refundAmount
        });
    }

    return list;
}
module.exports.detail = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var userName = obj.username || '';
    var enterpriseId = req.query.enterpriseId;

    var data = yield CompanyService.companyDetail({enterpriseId: enterpriseId, userId: userId});
    var nav = _navFactory({
        navList: [
            {name: '公司列表', path: '/company'},
            {name: '公司详情', path: '/company/detail?enterpriseId=' + enterpriseId}
        ]
    });

    var gk_data = data.data.enterpriseInfo;
    gk_data.operate = {
        operateType: 0,
        operateList: [{
            name: '配置', 
            href:'/company/info?enterpriseId=' + gk_data.enterpriseId +
            '&enterpriseName=' + gk_data.enterpriseName
        }]
    };

    var gk1_table = _tableFactory({
        thead: [
            {name: '公司名称', value: 'enterpriseName'}, 
            {name: '联系人', value: 'contact'}, 
            {name: '联系人电话', value: 'contactMobile'}, 
            {name: '操作', value: 'operate'}
        ],
        tbody: [gk_data]
    });

    var gk2_table = _tableFactory({
        thead: [
            {name: '委托案件总量', value: 'debtTotalNum'}, 
            {name: '当前委托案件量', value: 'debtCurrentNum'}, 
            {name: '委托案件总额', value: 'debtTotalAmount', type: 'money'}, 
            {name: '当前委托案件金额', value: 'debtCurrentAmount', type: 'money'},
            {name: '最近委托案件日期', value: 'debtLastCreateDate', type:'date'},
            {name: '最近案件更新日期', value: 'debtLastUpdateDate', type:'date'}
        ],
        tbody: [gk_data]
    });

    var ls_table = _tableFactory({
        thead: [
            {name: '结算日期', value: 'refundDate', type:'date'}, 
            {name: '结算金额', value: 'refundAmount', type: 'money'}, 
            {name: '结算方式', value: 'refundType'}, 
            {name: '关联案件数', value: 'linkDebtNum'}
        ],
        tbody: filterRefundHistory(data.data.refundHistory)
    });


    res.render('company/detail/index', {
        common: {
            userName: userName
        },
        pageTitle: '公司详情',
        reactOutput: [
            ReactServer.renderToString(nav),
            ReactServer.renderToStaticMarkup(_titleFactory({title:'概况'})),
            ReactServer.renderToString(gk1_table),
            ReactServer.renderToString(gk2_table),
            ReactServer.renderToStaticMarkup(_titleFactory({title:'结算历史'})),
            ReactServer.renderToString(ls_table)
        ].join('')
    });
});

module.exports.info = wrap(function * (req, res, next) {
    var query = req.query,
        enterpriseId = query.enterpriseId,
        enterpriseName = query.enterpriseName;//会被注入html片段 暂不考虑

    var nav = _navFactory({
        navList: [
            {name: '公司列表', path: '/company'},
            {name: '公司详情', path: '/company/detail?enterpriseId=' + enterpriseId},
            {name: '公司配置', path: '/company/info?enterpriseId=' + enterpriseId+'&enterpriseName=' + enterpriseName}
        ]
    });

    var obj = yield Cache.get(req.cookies.uuid);
    var userName = obj.username || '';
    var userId  = obj.userId ||''; 
    var detail = yield CompanyService.companyDetail({enterpriseId: enterpriseId, userId: userId});

    if (0 !== +_.get(detail, "error.returnCode")) {
        console.error('invok CompanyService.companyDetail exception');
        throw new Error('invok CompanyService.companyDetail exception');
    }
    var euuid = detail.data.enterpriseInfo.enterpiseUuid;
    var overdueRewardInfo = yield CompanyService.overdueRewardInfo({uuid: euuid, userId: userId});
    if (0 !== +_.get(overdueRewardInfo, "error.returnCode")) {
        console.error('invok CompanyService.overdueRewardInfo exception');
        throw new Error('invok CompanyService.overdueRewardInfo exception');
    }
    var params  = cloneDeep(detail.data.enterpriseInfo);
    params.overdueRewardInfo = overdueRewardInfo.data;

    res.render('company/add-modify/index', {
        common: {
            userName: userName
        },
        pageTitle: '公司配置',
        reactOutput: [
            ReactServer.renderToString(nav),
        ].join(''),
        initDataOutput: initDataToString({
            formData: params
        })
    });
})

module.exports.new = wrap(function * (req, res, next) {
    var nav = _navFactory({
        navList: [
            {name: '公司列表', path: '/company'},
            {name: '新增公司', path: '/company/new'}
        ]
    });
    var obj = yield Cache.get(req.cookies.uuid);
    var userName = obj.username || '';

    res.render('company/add-modify/index', {
        common: {
            userName: userName
        },
        pageTitle: '新增公司',
        reactOutput: [
            ReactServer.renderToString(nav)
        ].join(''),
        initDataOutput:''
    });
});

module.exports.update = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var param = {
        userId: userId,
        enterpriseId: req.body.enterpriseId,
        contact: req.body.contact,
        contactMobile: req.body.contactMobile,
        overdueRewardInfo: req.body.overdueRewardInfo
    }

    var data = yield CompanyService.companyModify(param);
    res.send(data);
});

module.exports.add = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var param = {
        userId: userId,
        name: req.body.enterpriseName,
        briefName: req.body.briefName,
        enBrief: req.body.enBrief,
        contact: req.body.contact,
        contactMobile: req.body.contactMobile,
        overdueRewardInfo: req.body.overdueRewardInfo
    }

    var data = yield CompanyService.companyAdd(param);
    res.send(data);
});
