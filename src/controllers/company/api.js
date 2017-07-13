var CompanyService = require('../../services/company.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');

module.exports.overdueRewardInfo = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield CompanyService.overdueRewardInfo({
        userId: userId,
        uuid: req.body.uuid
    });
    res.send(result);
});
