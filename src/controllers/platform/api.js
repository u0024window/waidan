var PlatformService = require('../../services/platform.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');

module.exports.bonusTaxModify = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid) || {};
    var userId = obj.userId;

    var result = yield PlatformService.bonusTaxModify({
        userId: userId,
        governmentTax: req.body.governmentTax,
        platformTax: req.body.platformTax
    });
    res.send(result);
});

