var fs = require('fs-extra');
var util = require('util');
var winston = require('winston');
var DailyRotateFile = require('winston-daily-rotate-file');

// 确认logs所需目录存在
fs.ensureDirSync('logs/access/');
fs.ensureDirSync('logs/info/');
fs.ensureDirSync('logs/error/');

var accessLoger = new winston.Logger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            colorize: true
        }),
        new DailyRotateFile({
            filename: 'logs/access/access.log',
            prepend: true
        })
    ]
});

var infoLoger = new winston.Logger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            colorize: true
        }),
        new DailyRotateFile({
            filename: 'logs/info/info.log',
            prepend: true
        })
    ]
});

var errorLoger = new winston.Logger({
    level: 'error',
    transports: [
        new winston.transports.Console({
            colorize: true
        }),
        new DailyRotateFile({
            filename: 'logs/error/error.log',
            prepend: true
        })
    ]
});




function formatArgs(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function(){
    infoLoger.info.apply(infoLoger, formatArgs(arguments));
};
console.info = function(){
    infoLoger.info.apply(infoLoger, formatArgs(arguments));
};
console.warn = function(){
    infoLoger.warn.apply(infoLoger,formatArgs(arguments));
};
console.error = function(){
    errorLoger.error.apply(errorLoger, formatArgs(arguments));
};
console.debug = function(){
    infoLoger.debug.apply(infoLoger, formatArgs(arguments));
};

module.exports = function (req, res, next) {
    accessLoger.info(req.method, req.url, res.statusCode);
    next();
}
