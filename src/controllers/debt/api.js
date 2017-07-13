var fs = require('fs-extra');
var DebtService = require('../../services/debt.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');

module.exports.roundNoRefund = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var x = {};
    var result = yield DebtService.roundNoRefund({
        userId: userId,
        debtIds: req.body.debtIds,
        method: req.body.method // 请求方式（single=案件详情页调用；batch=列表页批量调用。)
    });
    res.send(result);
});

module.exports.removeSuspectedRepeat = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var result = yield DebtService.removeSuspectedRepeat({
        userId: userId,
        debtId: req.body.debtId
    });
    res.send(result);
});

module.exports.saveDetail = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var result = yield DebtService.saveDetail(Object.assign({}, req.body));
    res.send(result);
});

module.exports.getCollRecodByPage = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield DebtService.getCollRecodByPage({
        userId: userId,
        caseId: req.body.caseId,
        pageNo: req.body.pageNo,
        pageSize: req.body.pageSize
    });
    res.send(result);
});

module.exports.refundPause = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield DebtService.refundPause({
        userId: userId,
        debtId: req.body.debtId,
        refundId: req.body.refundId
    });
    res.send(result);
});

module.exports.close = wrap(function * (req, res, next) {

    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var result = yield DebtService.close({
        userId: userId,
        reasonCode: req.body.reasonCode,
        remark: req.body.remark,
        debtIds: req.body.debtId
    });

    res.send(result);
});

module.exports.caseCloseReasons = wrap(function * (req, res, next) {

    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var result = yield DebtService.getCloseReasons({
        userId: userId,
        debtIds: req.body.debtIds
    });

    res.send(result);
});

module.exports.sendToRrc = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield DebtService.sendToRrc({
        userId: userId,
        debtIds: req.body.debtIds
    });
    res.send(result);
});

module.exports.collectRecordExport = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var params = Object.assign({}, req.body);
    params.userId = userId;

    // 催记导出，不需要这两个字段
    delete params.roundRefundAmountBegin;
    delete params.roundRefundAmountEnd;

    var result = yield DebtService.collectRecordExport(params);
    res.send(result);
});

module.exports.exception = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield DebtService.exception({
        userId: userId,
        debtId: req.body.debtId
    })
    res.send(result);
});

module.exports.unexception = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid)
    var userId = obj.userId;

    var result = yield DebtService.unexception({
        userId: userId,
        debtId: req.body.debtId
    });
    res.send(result);
});

module.exports.refundConfirm = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid)
    var userId = obj.userId;

    var result = yield DebtService.refundConfirm({
        userId: userId,
        debtId: req.body.debtId
    });
    res.send(result);
});

module.exports.extendEntrustDate = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield DebtService.extendEntrustDate({
        userId: userId,
        debtIds: req.body.debtIds,
        entrustEndDate: req.body.entrustEndDate
    });

    res.send(result);
});

module.exports.refund = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result  = yield DebtService.refund({
        userId: userId,
        debtId: req.body.debtId,
        refundAmount: req.body.refundAmount,
        refundDate: req.body.refundDate
    });
    res.send(result);
});

module.exports.submit = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;
    var filePath = req.file.path;
    var params = Object.assign({}, req.body);
    params.userId = userId;
    params.uploadFile = fs.createReadStream(filePath);
    DebtService.upload(params, function (result) {
        res.send(result);
        fs.unlink(filePath);
    });
});
