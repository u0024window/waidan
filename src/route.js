module.exports = function (router) {
    var exclude = [
        '/login',
        '/logout',
        '/',
        '/index',
        '/error',
        '/api/login'

    ]
    var loginAuthen = require('./controllers/login/api.js').loginAuthen;
    var regStr = `^((?!${exclude.join('$|').replace(/\//g, '\/')}$|\/static\/).)*$`;
    router.all(new RegExp(regStr, 'g'),loginAuthen);

	//login
    router.get('/login', require('./controllers/login/index.js').login);
    router.get('/logout', require('./controllers/login/index.js').logout);
    router.get('/', require('./controllers/login/index.js').login);
    router.get('/index', require('./controllers/common.js').hello)
    router.get('/error', require('./controllers/common.js').error)
    router.post('/api/login', require('./controllers/login/api.js').check);

    //company
    var companyCtrl = require('./controllers/company.js');
    var companyApi = require('./controllers/company/api.js');
    router.get('/company', companyCtrl.list);
    router.get('/company/detail', companyCtrl.detail);
    router.get('/company/info', companyCtrl.info);
    router.get('/company/new', companyCtrl.new);
    router.post('/api/company/modify', companyCtrl.update);
    router.post('/api/company/add', companyCtrl.add);
    router.post('/api/enterprise/overdueRewardInfo', companyApi.overdueRewardInfo);



    //debt
    router.get('/debt/list', require('./controllers/debt/list.js'));
    router.get('/debt/detail/:debtId',require('./controllers/debt/detail.js'));
    router.get('/debt/modifyhistory/:debtId',require('./controllers/debt/modifyHistory.js'));
    router.get('/debt/upload', require('./controllers/debt/upload.js'));
    router.get('/debt/download/:uploadId',require('./controllers/debt/download.js'));
    router.get('/debt/history-upload',require('./controllers/debt/historyUpload.js'));
    router.get('/debt/history-update',require('./controllers/debt/historyUpdate.js'));
    router.get('/debt/history-commission',require('./controllers/debt/historyCommission.js'));

    //debt-api
    router.post('/api/debt/refund-pause', require('./controllers/debt/api.js').refundPause);
    router.post('/api/debt/send-to-rrc', require('./controllers/debt/api.js').sendToRrc);
    router.post('/api/debt/close', require('./controllers/debt/api.js').close);
    router.post('/api/debt/case-close-reasons', require('./controllers/debt/api.js').caseCloseReasons);
    router.post('/api/debt/refund', require('./controllers/debt/api.js').refund);
    router.post('/api/debt/extend-entrust-date', require('./controllers/debt/api.js').extendEntrustDate);
    router.post('/api/debt/upload-submit', require('./services/common/uploader.js').single('uploadFile'), require('./controllers/debt/api.js').submit);
    router.post('/api/debt/exception', require('./controllers/debt/api.js').exception);
    router.post('/api/debt/unexception', require('./controllers/debt/api.js').unexception);
    router.post('/api/debt/refund-confirm', require('./controllers/debt/api.js').refundConfirm);
    router.post('/api/debt/collectRecordExport', require('./controllers/debt/api.js').collectRecordExport);
    router.post('/api/debt/getCollRecodByPage', require('./controllers/debt/api.js').getCollRecodByPage);
    router.post('/api/debt/saveDetail', require('./controllers/debt/api.js').saveDetail);
    router.post('/api/debt/removeSuspectedRepeat', require('./controllers/debt/api.js').removeSuspectedRepeat);
    router.post('/api/debt/roundNoRefund', require('./controllers/debt/api.js').roundNoRefund);


    //platform
    router.get('/platform/rateconf', require('./controllers/platform/rateConf.js'));

    //platform-api
    router.post('/api/platform/bonusTax/modify', require('./controllers/platform/api.js').bonusTaxModify);

    // common-history
    router.get('/common-history', require('./controllers/common-history/index.js'));

    // common
    router.post('/api/region/queryByCode', require('./controllers/common.js').getRegion);

    router.get('/download/template/:fileName',require('./controllers/common.js').download);


    // must be at the bottom
    router.use(require('./controllers/common.js').error);
}



