/**
 * @overview
 *
 * @author
 * @version 2016/10/11
 */
var React = require('react');
var ReactServer = require('react-dom/server');
var PlatformService = require('../../services/platform.js');
var Cache = require('../../helpers/redisCache.js');
var wrap = require('../../helpers/controllerWrap.js');
var initDataToString = require('../../helpers/initDataString.js');
var _ = require('lodash');


module.exports = wrap(function * (req, res, next) {
    var ConfForm = React.createFactory(require('views/platform/rate-conf/conf-form.jsx'));
    var Nav = React.createFactory(require('views/common/nav.jsx'));
    var reactOutput = [];

    var obj = yield Cache.get(req.cookies.uuid) || {};
    var userName = obj.username || '';
    var userId = obj.userId;

    var result = yield PlatformService.bonusTaxQuery({
        userId: userId
    });

    var headDataOutput = initDataToString({
        formData: result.data
    });

    if(0 === _.get(result, 'error.returnCode')) {
        reactOutput.push(ReactServer.renderToString(Nav({navList: [
            {
                path: '/platform/rateconf',
                name: '费率设置'
            }
        ]})));
        res.render('platform/rate-conf/index', {
            common: {
                userName: userName
            },
            reactOutput: reactOutput.join(''),
            headDataOutput: headDataOutput,
            confFormOutput: ReactServer.renderToString(ConfForm({data: result.data}))
        });
    }
    else {
        console.error('invoke api return exception');
        throw new Error('invoke api return exception');
    }
});


