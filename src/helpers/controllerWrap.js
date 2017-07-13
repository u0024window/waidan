var co =  require('co');
require('babel-polyfill');

module.exports = function (fn){

    return function (req, res, next) {

        var fnx = co.wrap(fn);
        fnx(req, res, next)
            .catch(function (err){
                next(err);
            })
    }
}

