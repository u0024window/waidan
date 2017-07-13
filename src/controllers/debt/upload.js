var React = require('react');
var ReactServer = require('react-dom/server');
var path = require('path');
var CompanyService = require('../../services/company.js');
var DebtService = require('../../services/debt.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');

module.exports = wrap(function * (req, res, next) {
    var navFactory = React.createFactory(require('views/common/nav.jsx'));
    var titleFactory = React.createFactory(require('views/common/title.jsx'));
    var formFactory = React.createFactory(require('views/debt/upload/upload-form.jsx'));

    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var userName = obj.username || '';
    var a = yield DebtService.getEnterpriseList({
        userId: userId
    })
    var results = yield [a];

    if (!(results[0] && results[0].error && 0 === +results[0].error.returnCode)){
        console.error('invoke api return exception');
        throw new Error('invoke api return exception');
    }
    var nav = navFactory({
        navList: [
            {name: '上传案件', path: '/debt/upload'},
        ]
    });

    var form = formFactory({
        'enterpriseList': results[0].data
    });

    res.render('debt/upload/upload', {
        common: {
            userName: userName 
        },
        reactOutput: [
            ReactServer.renderToStaticMarkup(nav),
            ReactServer.renderToString(form),
            ReactServer.renderToStaticMarkup(titleFactory({title:'解析结果'}))
        ].join('')
    });
});
