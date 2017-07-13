/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var DebtService = require('../../services/debt.js');
var CommonRegionService = require('../../services/commonRegion.js');
var initDataToString = require('../../helpers/initDataString.js');
var cloneDeep = require('clone-deep');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');

function checkResults(results) {

    return results &&
        results.length === 4 &&
        results[0].error &&
        +results[0].error.returnCode === 0 &&
        results[0].data &&
        results[1].error &&
        +results[1].error.returnCode === 0 &&
        results[1].data &&
        +results[2].error.returnCode === 0 &&
        results[2].data &&
        +results[3].error.returnCode === 0 &&
        results[3].data

}

module.exports = wrap(function * (req, res, next) {
    var readOnly = req.query.readOnly === '1' ? true : false;
    var debtId = req.params.debtId;
    var Detail = React.createFactory(require('views/debt/detail/detail.entry.jsx'));

    var obj = yield Cache.get(req.cookies.uuid)
    var userId = obj.userId;
    var userName = obj.username || '';

    var a = DebtService.getCloseReasons({
        userId: userId,
        debtIds: debtId
    });
    var b = DebtService.getDetail({
        debtId: debtId
    })
    var c = DebtService.getCollRecodByPage({
        caseId: debtId,
        userId: userId,
        pageNo: 1,
        pageSize: 20
    })
    var d = CommonRegionService.getRegion({
        code: 0
    })

    var results = yield [a, b, c, d];

    if (!checkResults(results)) {
        console.error('invoke api exception');
        throw new Error('invoke api exception');
    }

    let reasons = results[0].data;
    let result = results[1];
    let collRecordData = results[2].data;
    collRecordData.debtId = debtId;

    let debtorInfo = result.data.debtorInfo;

    var regionList = [
        debtorInfo.snProvince,
        debtorInfo.usualProvince,
        debtorInfo.companyProvince,
        debtorInfo.ecProvince,
        debtorInfo.snCity,
        debtorInfo.usualCity,
        debtorInfo.companyCity,
        debtorInfo.ecCity
    ]
    var hold = []
    regionList.forEach(function (item) {
        if (item) {
            hold.push(CommonRegionService.getRegion({
                code: item
            }));
        }
    });
    var holdResult = yield hold;
    var regions = {}
    var idx = 0;
    regionList.forEach(function (item) {
        if (item && holdResult[idx]) {
            regions[item] = holdResult[idx].data;
            idx ++;
        }
    })

    let detailData = {
        readOnly: readOnly,
        debtId: debtId,
        province: results[3].data,
        regions: regions,
        reasons: reasons,
        detail: result.data,
        collRecordData: collRecordData
    }
    
    let templateData = {
        common: {
            userName: userName
        },
        initDataOutput: initDataToString({detailData: detailData}),
        reactOutput: ReactServer.renderToString(Detail({data: detailData}))
    };

    if (readOnly) {
        templateData.layout = 'layouts/blank';
        res.render('debt/detail/index-blank', templateData);
    }
    else {
        res.render('debt/detail/index', templateData);
    }
});
