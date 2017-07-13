var wrap = require('../helpers/controllerWrap.js');
var CommonService = require('../services/commonRegion.js');
var DownloadService = require('../services/common/download.js');
var Cache = require('../helpers/redisCache.js');

module.exports.hello = function (req, res, next) {
    res.render('common/hello');
}
module.exports.error = function (err, req, res, next) {
    console.error('common exception process: ', err);
    var isAjaxRequest = req.xhr;
    if (isAjaxRequest) {
        var ajaxResult = {
            error : {
                "returnCode": -999,
                "returnMessage": (err ? err.toString() : err),
                "returnUserMessage": err ? err.toString() : '服务异常'
            },
            data: null
        }
        res.json(ajaxResult);
    }
    else {
        res.render('common/error', {
            layout: 'layouts/blank',
            output: err
        });
    }
}

module.exports.getRegion = wrap(function * (req, res, next) {
    var obj = yield Cache.get(req.cookies.uuid);
    var userId = obj.userId;

    var result = yield CommonService.getRegion({
        code: req.body.code
    });
    res.send(result);
});

module.exports.download = function (req, res, next) {
    DownloadService.download({}, req.params.fileName).pipe(res)
}
