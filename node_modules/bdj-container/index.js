var path = require('path');
var argv = require('yargs').argv;
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./lib/logger.js');
var load = require('express-load');
var winston = require('winston');
var app = express();

app.use(compression());
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.enable('trust proxy');
app.use(require('express-ejs-layouts'));
app.set('layout', 'page/layouts/default');
app.use(require('express-fileupload')());

/**
 * 转给 Roter 处理路由
 */

var appPath,
    publicPath,
    viewsPath,
    controllerPath,
    route,
    faviconPath;

function loadRouter(){
    var router = express.Router();
    load('route.js', {cwd: appPath})
        .into(router);
    app.use(router);
}
module.exports = {
    createApp: function (config) {
        /** * 设置模板解析
         */
        appPath = config.appPath || path.join(__dirname, '/app');
        publicPath = config.publicPath || path.join(__dirname, '/public');

        viewsPath = config.viewsPath || path.join(appPath, '/views');
        controllerPath = config.controllerPath || path.join(appPath, '/controllers');
        route = config.routePath || path.join(appPath, '/route.js');
        faviconPath = config.faviconPath || path.join(__dirname, '/public/favicon.ico');

        app.set('views', viewsPath);
        app.use(express.static(publicPath));

        //注册ejs模板为html页。简单的讲，就是原来以.ejs为后缀的模板页，现在的后缀名可以//是.html了
        app.engine('.html', require('ejs').__express);

        //设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
        app.set('view engine', 'html');


        /**
         * 中间件
         */
        app.set('port', argv.prod ? 80 : 8080);

        loadRouter();

        return app;
    },
    reloadRouter: function (){
        loadRouter();
    }
}

